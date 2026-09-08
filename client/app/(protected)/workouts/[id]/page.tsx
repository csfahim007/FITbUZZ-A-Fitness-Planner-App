'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { exerciseService, workoutService } from '@/lib/api/services';
import type { Exercise, Workout, WorkoutExercise } from '@/types/domain';
import { Loading } from '@/components/ui/Loading';
import { ApiState } from '@/components/ui/ApiState';
import { ShareWorkout } from '@/components/workouts/ShareWorkout';

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
}

function toDateLabel(value?: string) {
  const dateValue = toDateInputValue(value);
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString();
}

function estimateExerciseCalories(entry: WorkoutExercise) {
  const exercise =
    typeof entry.exercise === 'string' ? null : entry.exercise;

  const caloriesPerRep = Number(exercise?.caloriesPerRep ?? 0);
  const sets = Number(entry.sets ?? 0);
  const reps = Number(entry.reps ?? 0);

  return caloriesPerRep * sets * reps;
}

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<Workout | null>(null);
  const [exerciseOptions, setExerciseOptions] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');

  const [draftSets, setDraftSets] = useState('3');
  const [draftReps, setDraftReps] = useState('10');
  const [draftWeight, setDraftWeight] = useState('0');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      workoutService.get(id),
      exerciseService.list(),
    ])
      .then(([workoutResponse, exerciseResponse]) => {
        setItem(workoutResponse.data);
        setExerciseOptions(exerciseResponse.data);

        if (exerciseResponse.data[0]) {
          setSelectedExerciseId(exerciseResponse.data[0]._id);
        }
      })
      .catch((reason) => {
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load workout',
        );
      });
  }, [id]);

  async function persistWorkout(nextExercises: WorkoutExercise[]) {
    if (!item || !id) return;

    setSaving(true);
    setError('');

    try {
      const normalizedExercises = nextExercises.map((entry) => ({
        ...entry,
        exercise:
          typeof entry.exercise === 'string'
            ? entry.exercise
            : entry.exercise._id,
      }));

      const response = await workoutService.update(id, {
        exercises: normalizedExercises,
        date: item.date || new Date().toISOString(),
      });

      setItem(response.data);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save workout',
      );
    } finally {
      setSaving(false);
    }
  }

  async function addExercise() {
    if (!item || !selectedExerciseId) return;

    const nextExercises: WorkoutExercise[] = [
      ...item.exercises,
      {
        exercise: selectedExerciseId,
        sets: Number(draftSets) || 0,
        reps: Number(draftReps) || 0,
        weight: Number(draftWeight) || 0,

        // New exercises are not completed yet.
        completed: false,

        // No completion date until the exercise is actually completed.
        completedAt: undefined,

        // Will be populated when the exercise is completed.
        caloriesBurned: 0,
      },
    ];

    await persistWorkout(nextExercises);

    setDraftSets('3');
    setDraftReps('10');
    setDraftWeight('0');
  }

  async function updateExerciseEntry(
    index: number,
    patch: Partial<WorkoutExercise>,
  ) {
    if (!item) return;

    const nextExercises = item.exercises.map(
      (entry, entryIndex) => {
        if (entryIndex !== index) return entry;

        return {
          ...entry,
          ...patch,
        };
      },
    );

    await persistWorkout(nextExercises);
  }

  if (!item && !error) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="content-container py-12">
        <ApiState message={error} />
      </div>
    );
  }

  const availableExercises = exerciseOptions.filter(
    (exercise) =>
      !(item?.exercises ?? []).some((entry) => {
        const exerciseId =
          typeof entry.exercise === 'string'
            ? entry.exercise
            : entry.exercise._id;

        return exerciseId === exercise._id;
      }),
  );

  return (
    <div className="content-container py-12">
      <Link
        href="/workouts"
        className="text-sm font-bold text-mint"
      >
        ← Back to workouts
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-900 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-mint">
          Workout plan
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {item?.name}
        </h1>

        <p className="mt-3 text-slate-600">
          {item?.exercises.length || 0} exercises ·{' '}
          {item?.totalCalories || 0} completed calories
          {item?.date ? ` · ${toDateLabel(item.date)}` : ''}
        </p>

        <label className="mt-5 block max-w-xs text-sm font-semibold text-slate-700">
          Workout date

          <input
            type="date"
            value={toDateInputValue(item?.date)}
            onChange={async (event) => {
              if (!item) return;

              setSaving(true);
              setError('');

              try {
                const response = await workoutService.update(id, {
                  date: event.target.value,
                  exercises: item.exercises,
                });

                setItem(response.data);
              } catch (reason) {
                setError(
                  reason instanceof Error
                    ? reason.message
                    : 'Unable to save workout date',
                );
              } finally {
                setSaving(false);
              }
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          />
        </label>

        <div className="mt-6">
          <ShareWorkout workoutId={id} />
        </div>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-black">
            Exercises
          </h2>

          <span className="text-sm text-slate-500">
            {saving ? 'Saving...' : 'Ready'}
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Exercise

              <select
                value={selectedExerciseId}
                onChange={(event) =>
                  setSelectedExerciseId(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                {availableExercises.length === 0 ? (
                  <option value="">
                    No more exercises available
                  </option>
                ) : (
                  <>
                    <option value="">
                      Select an exercise
                    </option>

                    {availableExercises.map((exercise) => (
                      <option
                        key={exercise._id}
                        value={exercise._id}
                      >
                        {exercise.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Sets

              <input
                type="number"
                min="0"
                value={draftSets}
                onChange={(event) =>
                  setDraftSets(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Reps

              <input
                type="number"
                min="0"
                value={draftReps}
                onChange={(event) =>
                  setDraftReps(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Weight (kg)

              <input
                type="number"
                min="0"
                step="0.5"
                value={draftWeight}
                onChange={(event) =>
                  setDraftWeight(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => void addExercise()}
            disabled={
              !selectedExerciseId ||
              availableExercises.length === 0
            }
            className="mt-4 rounded-lg bg-mint px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add exercise
          </button>
        </div>

        {item?.exercises.length ? (
          <div className="mt-5 space-y-4">
            {item.exercises.map((entry, index) => {
              const exerciseDetails =
                typeof entry.exercise === 'string'
                  ? exerciseOptions.find(
                      (exercise) =>
                        exercise._id === entry.exercise,
                    )
                  : entry.exercise;

              const estimatedCalories =
                estimateExerciseCalories(entry);

              return (
                <div
                  key={`${index}-${typeof entry.exercise === 'string'
                    ? entry.exercise
                    : entry.exercise._id}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  {/* Exercise header */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {exerciseDetails?.name || 'Exercise'}
                      </p>

                      {!entry.completed && (
                        <p className="text-sm text-slate-500">
                          Estimated burn:{' '}
                          {estimatedCalories} kcal
                        </p>
                      )}

                      {entry.completed && entry.completedAt && (
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>
                            Completed {toDateLabel(entry.completedAt)} ·{' '}
                            {entry.caloriesBurned || estimatedCalories} kcal
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedIndex(
                                expandedIndex === index
                                  ? null
                                  : index,
                              )
                            }
                            className="font-bold text-mint hover:underline"
                          >
                            {expandedIndex === index
                              ? 'Hide details'
                              : 'Edit details'}
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const completed = !entry.completed;

                        if (completed) {
                          const calories =
                            Number(entry.caloriesBurned || 0) ||
                            estimatedCalories;

                          void updateExerciseEntry(index, {
                            completed: true,

                            // Store the actual local calendar date.
                            completedAt:
                              new Date().toLocaleDateString(
                                'en-CA',
                              ),

                            caloriesBurned: calories,
                          });

                          setExpandedIndex(null);
                        } else {
                          void updateExerciseEntry(index, {
                            completed: false,
                            completedAt: undefined,
                            caloriesBurned: 0,
                          });

                          setExpandedIndex(index);
                        }
                      }}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                        entry.completed
                          ? 'bg-mint/10 text-mint ring-1 ring-mint'
                          : 'bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {entry.completed
                        ? '✓ Completed'
                        : 'Mark done'}
                    </button>
                  </div>

                  {/* Exercise details */}
                  {(!entry.completed ||
                    expandedIndex === index) && (
                    <div
                      className={`mt-4 grid gap-3 ${
                        entry.completed
                          ? 'md:grid-cols-5'
                          : 'md:grid-cols-4'
                      }`}
                    >
                      {/* Sets */}
                      <label className="text-sm font-semibold text-slate-700">
                        Sets

                        <input
                          type="number"
                          min="0"
                          value={entry.sets ?? 0}
                          onChange={(event) =>
                            void updateExerciseEntry(
                              index,
                              {
                                sets:
                                  Number(
                                    event.target.value,
                                  ) || 0,
                              },
                            )
                          }
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                        />
                      </label>

                      {/* Reps */}
                      <label className="text-sm font-semibold text-slate-700">
                        Reps

                        <input
                          type="number"
                          min="0"
                          value={entry.reps ?? 0}
                          onChange={(event) =>
                            void updateExerciseEntry(
                              index,
                              {
                                reps:
                                  Number(
                                    event.target.value,
                                  ) || 0,
                              },
                            )
                          }
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                        />
                      </label>

                      {/* Weight */}
                      <label className="text-sm font-semibold text-slate-700">
                        Weight (kg)

                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={entry.weight ?? 0}
                          onChange={(event) =>
                            void updateExerciseEntry(
                              index,
                              {
                                weight:
                                  Number(
                                    event.target.value,
                                  ) || 0,
                              },
                            )
                          }
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                        />
                      </label>

                      {/* Burned calories — completed exercises only */}
                      {entry.completed && (
                        <label className="text-sm font-semibold text-slate-700">
                          Burned (kcal)

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={entry.caloriesBurned ?? 0}
                            onChange={(event) =>
                              void updateExerciseEntry(
                                index,
                                {
                                  caloriesBurned:
                                    Number(
                                      event.target.value,
                                    ) || 0,
                                },
                              )
                            }
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                          />
                        </label>
                      )}

                      {/* Done date */}
                      <label className="text-sm font-semibold text-slate-700">
                        Done date

                        <input
                          type="date"
                          value={
                            entry.completedAt
                              ? toDateInputValue(
                                  entry.completedAt,
                                )
                              : new Date().toLocaleDateString('en-CA')
                          }
                          onChange={(event) =>
                            void updateExerciseEntry(
                              index,
                              {
                                // Keep this as the exercise's
                                // completion date rather than
                                // the parent workout date.
                                completedAt:
                                  event.target.value,

                                completed: true,

                                // If no manual calorie value exists,
                                // use the calculated estimate.
                                caloriesBurned:
                                  Number(
                                    entry.caloriesBurned || 0,
                                  ) ||
                                  estimatedCalories,
                              },
                            )
                          }
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">
            No exercises added yet.
          </p>
        )}
      </section>
    </div>
  );
}