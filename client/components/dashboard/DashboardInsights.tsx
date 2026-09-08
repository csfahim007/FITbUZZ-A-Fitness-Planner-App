'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { exerciseService, workoutService } from '@/lib/api/services';
import type { Exercise, Workout } from '@/types/domain';
import { ApiState } from '@/components/ui/ApiState';
import { Loading } from '@/components/ui/Loading';

const dayFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'short',
});

const palette = [
  '#7dd3a8',
  '#a7f3d0',
  '#facc15',
  '#c084fc',
  '#f472b6',
  '#2dd4bf',
  '#60a5fa',
];

function dateKey(value: string | undefined) {
  if (!value) return '';

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function localDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function dateLabel(value: string | undefined) {
  const key = dateKey(value);

  return key
    ? new Date(`${key}T00:00:00`).toLocaleDateString()
    : 'Unscheduled';
}

/**
 * Calculate calories for one completed exercise.
 *
 * Priority:
 * 1. Manually recorded caloriesBurned
 * 2. Estimated calories from:
 *    caloriesPerRep × sets × reps
 */
function exerciseCalories(
  entry: Workout['exercises'][number],
) {
  const exercise =
    typeof entry.exercise === 'string'
      ? null
      : entry.exercise;

  const actualCalories = Number(
    entry.caloriesBurned ?? 0,
  );

  if (actualCalories > 0) {
    return actualCalories;
  }

  const caloriesPerRep = Number(
    exercise?.caloriesPerRep ?? 0,
  );

  const sets = Number(entry.sets ?? 0);
  const reps = Number(entry.reps ?? 0);

  return caloriesPerRep * sets * reps;
}

export function DashboardInsights() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      workoutService.list(),
      exerciseService.list(),
    ])
      .then(([workoutResponse, exerciseResponse]) => {
        setWorkouts(workoutResponse.data);
        setExercises(exerciseResponse.data);
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load insights',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - today.getDay(),
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(0, 0, 0, 0);

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );

  const [calendarMonth, setCalendarMonth] = useState(
    () =>
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
  );

  const [selectedDate, setSelectedDate] = useState(() =>
    localDateKey(today),
  );

  const [calendarSize, setCalendarSize] = useState<
    'compact' | 'expanded'
  >('compact');

  /**
   * Parent workout date.
   *
   * This remains responsible for:
   * - scheduled workouts
   * - planned workout calendar entries
   */
  const workoutDate = (workout: Workout) =>
    workout.date || workout.createdAt;

  const isSameDay = (
    value: string | undefined,
    date: Date,
  ) =>
    value
      ? new Date(value).toDateString() ===
        date.toDateString()
      : false;

  const summary = useMemo(() => {
    /*
     * -------------------------------------------------------
     * WORKOUT COUNTS
     * -------------------------------------------------------
     *
     * These continue to use the parent workout date because
     * they represent scheduled/logged workouts.
     */
    const weekly = workouts.filter((workout) => {
      const value = workoutDate(workout);

      if (!value) return false;

      return (
        new Date(value) >= startOfWeek &&
        new Date(value) < endOfWeek
      );
    });

    const monthly = workouts.filter((workout) => {
      const value = workoutDate(workout);

      if (!value) return false;

      return new Date(value) >= startOfMonth;
    });

    const scheduledWorkouts = [...workouts]
      .filter((workout) => {
        const value = workoutDate(workout);

        if (!value) return false;

        return new Date(value) >= startOfDay;
      })
      .sort(
        (a, b) =>
          new Date(
            workoutDate(a) as string,
          ).getTime() -
          new Date(
            workoutDate(b) as string,
          ).getTime(),
      )
      .slice(0, 4);

    /*
     * -------------------------------------------------------
     * DAILY CALORIES
     * -------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Do NOT use workout.date here.
     *
     * Calories belong to the date the individual exercise
     * was actually completed:
     *
     *     entry.completedAt
     *
     * This fixes the problem where a workout created on an
     * older date gets completed today and its calories
     * disappear from the current week's graph.
     */
    const dailyCalories = new Map<string, number>();

    workouts.forEach((workout) => {
      (workout.exercises || []).forEach((entry) => {
        /*
         * Only completed exercises count toward calories.
         */
        if (!entry.completed) {
          return;
        }

        /*
         * An exercise without completedAt has no reliable
         * day to put its calories into.
         */
        if (!entry.completedAt) {
          return;
        }

        const key = dateKey(entry.completedAt);

        if (!key) {
          return;
        }

        const calories = exerciseCalories(entry);

        dailyCalories.set(
          key,
          (dailyCalories.get(key) || 0) + calories,
        );
      });
    });

    /*
     * -------------------------------------------------------
     * WEEKLY CALORIE BARS
     * -------------------------------------------------------
     */
    const weekDays = Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date(startOfWeek);

        date.setDate(
          startOfWeek.getDate() + index,
        );

        const key = localDateKey(date);

        return {
          label: dayFormatter.format(date),
          date,
          key,
          value: dailyCalories.get(key) || 0,
        };
      },
    );

    /*
     * Weekly calories are now calculated from the seven
     * actual calendar days rather than workout.date.
     */
    const calories = weekDays.reduce(
      (sum, day) => sum + day.value,
      0,
    );

    /*
     * -------------------------------------------------------
     * CALENDAR
     * -------------------------------------------------------
     *
     * Planned workouts:
     *     workout.date
     *
     * Completed exercises:
     *     entry.completedAt
     */
    const calendarMap = new Map<
      string,
      {
        plannedWorkouts: {
          id: string;
          name: string;
        }[];

        completedExercises: {
          workoutId: string;
          workoutName: string;
          exerciseId?: string;
          exerciseName: string;
        }[];

        count: number;
      }
    >();

    workouts.forEach((workout) => {
      /*
       * Add the planned workout to its scheduled date.
       */
      const workoutDateValue =
        workoutDate(workout);

      if (workoutDateValue) {
        const dayKey = dateKey(
          workoutDateValue,
        );

        const calendarItem =
          calendarMap.get(dayKey) ?? {
            plannedWorkouts: [],
            completedExercises: [],
            count: 0,
          };

        calendarItem.plannedWorkouts.push({
          id: workout._id,
          name: workout.name,
        });

        calendarItem.count += 1;

        calendarMap.set(dayKey, calendarItem);
      }

      /*
       * Add completed exercises to their actual
       * completion date.
       */
      (workout.exercises || []).forEach(
        (entry) => {
          if (
            !entry.completed ||
            !entry.completedAt
          ) {
            return;
          }

          const completedDayKey = dateKey(
            entry.completedAt,
          );

          if (!completedDayKey) {
            return;
          }

          const calendarItem =
            calendarMap.get(
              completedDayKey,
            ) ?? {
              plannedWorkouts: [],
              completedExercises: [],
              count: 0,
            };

          const exerciseId =
            typeof entry.exercise === 'string'
              ? entry.exercise
              : entry.exercise?._id;

          const name =
            typeof entry.exercise === 'string'
              ? 'Exercise'
              : entry.exercise?.name ||
                'Exercise';

          calendarItem.completedExercises.push({
            workoutId: workout._id,
            workoutName: workout.name,
            exerciseId,
            exerciseName: name,
          });

          calendarMap.set(
            completedDayKey,
            calendarItem,
          );
        },
      );
    });

    /*
     * -------------------------------------------------------
     * MONTHLY CALENDAR
     * -------------------------------------------------------
     */
    const monthStart = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );

    const monthEnd = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    );

    const startCalendar = new Date(
      monthStart,
    );

    startCalendar.setDate(
      startCalendar.getDate() -
        startCalendar.getDay(),
    );

    const calendarDays = Array.from(
      { length: 42 },
      (_, index) => {
        const date = new Date(
          startCalendar,
        );

        date.setDate(
          startCalendar.getDate() + index,
        );

        const isoKey = localDateKey(date);

        const entry =
          calendarMap.get(isoKey) ?? {
            plannedWorkouts: [],
            completedExercises: [],
            count: 0,
          };

        return {
          date,
          isoKey,
          inMonth:
            date.getMonth() ===
              calendarMonth.getMonth() &&
            date.getFullYear() ===
              calendarMonth.getFullYear(),
          entry,
        };
      },
    );

    /*
     * -------------------------------------------------------
     * MUSCLE GROUPS
     * -------------------------------------------------------
     */
    const muscleGroups =
      exercises.reduce<Record<string, number>>(
        (groups, exercise) => {
          groups[exercise.muscleGroup] =
            (groups[exercise.muscleGroup] || 0) +
            1;

          return groups;
        },
        {},
      );

    const totalExercises =
      Object.values(muscleGroups).reduce(
        (sum, count) => sum + count,
        0,
      );

    const maxGroupCount = Math.max(
      ...Object.values(muscleGroups),
      1,
    );

    /*
     * -------------------------------------------------------
     * PIE CHART
     * -------------------------------------------------------
     */
    const entries =
      Object.entries(muscleGroups);

    const pieSegments = !entries.length
      ? 'conic-gradient(#e2e8f0 0 100%)'
      : (() => {
          let current = 0;

          const segments = entries.map(
            ([group, count], index) => {
              const color =
                palette[
                  index % palette.length
                ];

              const start = current;

              const end =
                current +
                (count / totalExercises) *
                  100;

              current = end;

              return `${color} ${start}% ${end}%`;
            },
          );

          return `conic-gradient(${segments.join(
            ', ',
          )})`;
        })();

    return {
      weekly,
      monthly,
      scheduledWorkouts,
      calories,
      dailyCalories,
      weekDays,
      totalExercises,
      maxGroupCount,
      muscleGroups,
      pieSegments,
      monthStart,
      monthEnd,
      calendarDays,
      calendarMap,
    };
  }, [
    calendarMonth,
    exercises,
    startOfDay,
    startOfMonth,
    startOfWeek,
    endOfWeek,
    workouts,
  ]);

  if (loading) {
    return (
      <Loading label="Building your insights..." />
    );
  }

  if (error) {
    return <ApiState message={error} />;
  }

  const {
    weekly,
    monthly,
    scheduledWorkouts,
    calories,
    totalExercises,
    maxGroupCount,
    weekDays,
    muscleGroups,
    pieSegments,
    monthStart,
    monthEnd,
    calendarDays,
    calendarMap,
  } = summary;

  const selectedDayDetails =
    calendarMap.get(selectedDate) ?? {
      plannedWorkouts: [],
      completedExercises: [],
      count: 0,
    };

  return (
    <section className="mt-10 space-y-6">
      {/* -------------------------------------------------- */}
      {/* WEEKLY RHYTHM + MUSCLE GROUPS */}
      {/* -------------------------------------------------- */}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-mint">
                Weekly rhythm
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Calorie burn
              </h2>
            </div>

            <span className="text-sm font-bold text-slate-500">
              {calories} kcal
            </span>
          </div>

          {/* Weekly calorie graph */}
          <div className="mt-8 flex h-48 items-end gap-3 border-b border-slate-200 pb-4">
            {weekDays.map((day) => {
              const maxCalories = Math.max(
                ...weekDays.map(
                  (item) => item.value,
                ),
                1,
              );

              const barHeight = Math.max(
                (day.value / maxCalories) *
                  100,
                day.value ? 10 : 4,
              );

              return (
                <div
                  key={day.key}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-mint to-lime transition-all"
                    style={{
                      height: `${barHeight}%`,
                    }}
                    title={`${day.value} kcal`}
                  />

                  <span className="text-xs font-semibold text-slate-500">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Muscle groups */}
        <div className="rounded-2xl bg-ink p-6 text-white shadow-sm ring-1 ring-slate-700">
          <p className="text-sm font-bold uppercase tracking-widest text-lime">
            Exercise balance
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Muscle groups
          </h2>

          <div className="mt-6 flex items-center gap-5">
            <div
              className="relative h-32 w-32 shrink-0 rounded-full shadow-inner"
              style={{
                background: pieSegments,
              }}
            >
              <div className="absolute inset-[22%] rounded-full bg-ink ring-4 ring-slate-800/80">
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-2xl font-black">
                      {totalExercises}
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      Total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {Object.keys(muscleGroups).length ? (
                Object.entries(
                  muscleGroups,
                ).map(
                  ([group, count], index) => (
                    <div key={group}>
                      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-200">
                        <span className="capitalize">
                          {group.replace(
                            '-',
                            ' ',
                          )}
                        </span>

                        <span>{count}</span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-700">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${
                              (count /
                                maxGroupCount) *
                              100
                            }%`,
                            background:
                              palette[
                                index %
                                  palette.length
                              ],
                          }}
                        />
                      </div>
                    </div>
                  ),
                )
              ) : (
                <p className="text-sm text-slate-300">
                  Add exercises to see your
                  balance.
                </p>
              )}
            </div>
          </div>

          <Link
            href="/exercises/new"
            className="mt-6 inline-flex rounded-lg bg-mint px-4 py-2 text-sm font-bold text-ink"
          >
            Add exercise
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* METRICS */}
      {/* -------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Today"
          value={
            workouts.filter((workout) =>
              isSameDay(
                workoutDate(workout),
                today,
              ),
            ).length
          }
          detail="workouts"
        />

        <Metric
          label="This week"
          value={weekly.length}
          detail={`${calories} kcal estimated`}
        />

        <Metric
          label="This month"
          value={monthly.length}
          detail="workouts logged"
        />
      </div>

      {/* -------------------------------------------------- */}
      {/* SCHEDULED WORKOUTS */}
      {/* -------------------------------------------------- */}

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-mint">
              Scheduled sessions
            </p>

            <h3 className="mt-2 text-xl font-black">
              Planned workouts
            </h3>
          </div>

          <Link
            href="/workouts"
            className="text-sm font-bold text-mint"
          >
            View all
          </Link>
        </div>

        {scheduledWorkouts.length ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {scheduledWorkouts.map(
              (workout) => (
                <div
                  key={workout._id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-base font-black text-ink">
                    {workout.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {dateLabel(
                      workoutDate(workout),
                    )}{' '}
                    ·{' '}
                    {workout.exercises.length}{' '}
                    exercises
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">
            No scheduled workouts yet. Add a
            date to a workout to see it here.
          </p>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* MONTHLY CALENDAR */}
      {/* -------------------------------------------------- */}

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-mint">
              Workout planner
            </p>

            <h3 className="mt-2 text-xl font-black">
              Monthly calendar
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex rounded-lg border border-slate-300 p-1 text-xs font-bold"
              aria-label="Calendar size"
            >
              <button
                type="button"
                onClick={() =>
                  setCalendarSize('compact')
                }
                className={`rounded px-2 py-1 ${
                  calendarSize === 'compact'
                    ? 'bg-ink text-white'
                    : 'text-slate-500'
                }`}
              >
                Small
              </button>

              <button
                type="button"
                onClick={() =>
                  setCalendarSize('expanded')
                }
                className={`rounded px-2 py-1 ${
                  calendarSize === 'expanded'
                    ? 'bg-ink text-white'
                    : 'text-slate-500'
                }`}
              >
                Big
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setCalendarMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() -
                      1,
                    1,
                  ),
                )
              }
              className="rounded-lg border border-slate-300 px-2 py-1 text-sm font-bold text-slate-600"
            >
              Prev
            </button>

            <span className="min-w-[140px] text-center text-sm font-bold text-slate-700">
              {monthStart.toLocaleDateString(
                'en-US',
                {
                  month: 'long',
                  year: 'numeric',
                },
              )}
            </span>

            <button
              type="button"
              onClick={() =>
                setCalendarMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() +
                      1,
                    1,
                  ),
                )
              }
              className="rounded-lg border border-slate-300 px-2 py-1 text-sm font-bold text-slate-600"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
          {[
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ].map((day) => (
            <div
              key={day}
              className="py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div
          className={`grid grid-cols-7 ${
            calendarSize === 'compact'
              ? 'gap-1'
              : 'gap-2'
          }`}
        >
          {calendarDays.map(
            ({
              date,
              isoKey,
              inMonth,
              entry,
            }) => {
              const isToday =
                date.toDateString() ===
                today.toDateString();

              const isSelected =
                isoKey === selectedDate;

              const workoutCount =
                entry.plannedWorkouts.length;

              const doneCount =
                entry.completedExercises.length;

              return (
                <button
                  type="button"
                  key={isoKey}
                  onClick={() =>
                    setSelectedDate(isoKey)
                  }
                  className={`${
                    calendarSize ===
                    'compact'
                      ? 'min-h-[58px] p-1.5'
                      : 'min-h-[100px] p-2'
                  } rounded-xl border text-left transition ${
                    inMonth
                      ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      : 'border-slate-100 bg-slate-100 text-slate-400'
                  } ${
                    isToday
                      ? 'ring-2 ring-mint'
                      : ''
                  } ${
                    isSelected
                      ? 'border-mint bg-mint/5 shadow-sm'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        inMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {workoutCount > 0 ||
                    doneCount > 0 ? (
                      <span className="rounded-full bg-mint px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {workoutCount +
                          doneCount}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`${
                      calendarSize ===
                      'compact'
                        ? 'mt-1'
                        : 'mt-2'
                    } space-y-1`}
                  >
                    {workoutCount > 0 ? (
                      <div className="rounded bg-lime-100 px-1 py-0.5 text-[10px] font-bold text-mint">
                        <span
                          className={
                            calendarSize ===
                            'compact'
                              ? 'sr-only'
                              : ''
                          }
                        >
                          {workoutCount}{' '}
                          workout
                          {workoutCount ===
                          1
                            ? ''
                            : 's'}
                        </span>

                        {calendarSize ===
                        'compact'
                          ? workoutCount
                          : null}
                      </div>
                    ) : null}

                    {doneCount > 0 ? (
                      <div className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700">
                        <span
                          className={
                            calendarSize ===
                            'compact'
                              ? 'sr-only'
                              : ''
                          }
                        >
                          {doneCount}{' '}
                          completed
                        </span>

                        {calendarSize ===
                        'compact'
                          ? doneCount
                          : null}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            },
          )}
        </div>

        {/* Selected day */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Selected day
            </p>

            <span className="text-sm font-bold text-slate-700">
              {new Date(
                `${selectedDate}T00:00:00`,
              ).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                },
              )}
            </span>
          </div>

          {selectedDayDetails
            .plannedWorkouts.length ||
          selectedDayDetails
            .completedExercises.length ? (
            <div className="mt-4 space-y-3">
              {/* Planned workouts */}
              {selectedDayDetails
                .plannedWorkouts.length ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-mint">
                    Workouts
                  </p>

                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {selectedDayDetails.plannedWorkouts.map(
                      (workout) => (
                        <li
                          key={workout.id}
                          className="rounded-lg bg-lime-100 px-3 py-2 font-semibold text-mint"
                        >
                          <Link
                            href={`/workouts/${workout.id}`}
                            className="hover:underline"
                          >
                            {workout.name}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : null}

              {/* Completed exercises */}
              {selectedDayDetails
                .completedExercises
                .length ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    Completed exercises
                  </p>

                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {selectedDayDetails.completedExercises.map(
                      (item) => (
                        <li
                          key={`${item.workoutId}-${
                            item.exerciseId ??
                            item.exerciseName
                          }`}
                          className="rounded-lg bg-amber-100 px-3 py-2 font-semibold text-amber-800"
                        >
                          <Link
                            href={`/workouts/${item.workoutId}`}
                            className="hover:underline"
                          >
                            {item.workoutName}:{' '}
                            {item.exerciseName}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No workouts or completed
              exercise check-ins on this day.
            </p>
          )}
        </div>

        {/* Legend */}
        {calendarMap.size ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Legend
            </p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-lime-200" />
                Planned workouts
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-200" />
                Exercise check-ins
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-ink">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {detail}
      </p>
    </div>
  );
}