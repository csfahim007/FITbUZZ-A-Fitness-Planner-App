'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { exerciseService, workoutService } from '@/lib/api/services';
import type { Exercise, Workout } from '@/types/domain';
import { ApiState } from '@/components/ui/ApiState';
import { Loading } from '@/components/ui/Loading';

const dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'short' });
const palette = ['#7dd3a8', '#a7f3d0', '#facc15', '#c084fc', '#f472b6', '#2dd4bf', '#60a5fa'];

export function DashboardInsights() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([workoutService.list(), exerciseService.list()])
      .then(([workoutResponse, exerciseResponse]) => {
        setWorkouts(workoutResponse.data);
        setExercises(exerciseResponse.data);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load insights'))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const workoutDate = (workout: Workout) => workout.date || workout.createdAt;
  const isSameDay = (value: string | undefined, date: Date) => (value ? new Date(value).toDateString() === date.toDateString() : false);

  const summary = useMemo(() => {
    const weekly = workouts.filter((workout) => workoutDate(workout) && new Date(workoutDate(workout) as string) >= startOfWeek);
    const monthly = workouts.filter((workout) => workoutDate(workout) && new Date(workoutDate(workout) as string) >= startOfMonth);
    const calories = weekly.reduce((sum, workout) => sum + (workout.totalCalories || 0), 0);

    const muscleGroups = exercises.reduce<Record<string, number>>((groups, exercise) => {
      groups[exercise.muscleGroup] = (groups[exercise.muscleGroup] || 0) + 1;
      return groups;
    }, {});

    const totalExercises = Object.values(muscleGroups).reduce((sum, count) => sum + count, 0);
    const maxGroupCount = Math.max(...Object.values(muscleGroups), 1);

    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      return {
        label: dayFormatter.format(date),
        value: workouts
          .filter((workout) => isSameDay(workoutDate(workout), date))
          .reduce((sum, workout) => sum + (workout.totalCalories || 0), 0),
      };
    });

    const entries = Object.entries(muscleGroups);
    const pieSegments = !entries.length
      ? 'conic-gradient(#e2e8f0 0 100%)'
      : (() => {
          let current = 0;
          const segments = entries.map(([group, count], index) => {
            const color = palette[index % palette.length];
            const start = current;
            const end = current + (count / totalExercises) * 100;
            current = end;
            return `${color} ${start}% ${end}%`;
          });

          return `conic-gradient(${segments.join(', ')})`;
        })();

    return {
      weekly,
      monthly,
      calories,
      totalExercises,
      maxGroupCount,
      weekDays,
      muscleGroups,
      pieSegments,
    };
  }, [exercises, startOfMonth, startOfWeek, workouts]);

  if (loading) return <Loading label="Building your insights..." />;
  if (error) return <ApiState message={error} />;

  const { weekly, monthly, calories, totalExercises, maxGroupCount, weekDays, muscleGroups, pieSegments } = summary;

  return (
    <section className="mt-10 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Today" value={workouts.filter((workout) => isSameDay(workout.createdAt, today)).length} detail="workouts" />
        <Metric label="This week" value={weekly.length} detail={`${calories} kcal estimated`} />
        <Metric label="This month" value={monthly.length} detail="workouts logged" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-mint">Weekly rhythm</p>
              <h2 className="mt-2 text-2xl font-black">Calorie burn</h2>
            </div>
            <span className="text-sm font-bold text-slate-500">{calories} kcal</span>
          </div>

          <div className="mt-8 flex h-48 items-end gap-3 border-b border-slate-200 pb-4">
            {weekDays.map((day) => (
              <div key={day.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-mint to-lime transition-all"
                  style={{
                    height: `${Math.max((day.value / Math.max(...weekDays.map((item) => item.value), 1)) * 100, day.value ? 10 : 4)}%`,
                  }}
                  title={`${day.value} kcal`}
                />
                <span className="text-xs font-semibold text-slate-500">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-ink p-6 text-white shadow-sm ring-1 ring-slate-700">
          <p className="text-sm font-bold uppercase tracking-widest text-lime">Exercise balance</p>
          <h2 className="mt-2 text-2xl font-black">Muscle groups</h2>

          <div className="mt-6 flex items-center gap-5">
            <div className="relative h-32 w-32 shrink-0 rounded-full shadow-inner" style={{ background: pieSegments }}>
              <div className="absolute inset-[22%] rounded-full bg-ink ring-4 ring-slate-800/80">
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-2xl font-black">{totalExercises}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {Object.keys(muscleGroups).length ? (
                Object.entries(muscleGroups).map(([group, count], index) => (
                  <div key={group}>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="capitalize">{group.replace('-', ' ')}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(count / maxGroupCount) * 100}%`,
                          background: palette[index % palette.length],
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-300">Add exercises to see your balance.</p>
              )}
            </div>
          </div>

          <Link href="/exercises/new" className="mt-6 inline-flex rounded-lg bg-mint px-4 py-2 text-sm font-bold text-ink">
            Add exercise
          </Link>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
