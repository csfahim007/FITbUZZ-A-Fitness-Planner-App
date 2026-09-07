'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { exerciseService, workoutService } from '@/lib/api/services';
import type { Exercise, Workout } from '@/types/domain';
import { ApiState } from '@/components/ui/ApiState';
import { Loading } from '@/components/ui/Loading';

const dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'short' });

export function DashboardInsights() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([workoutService.list(), exerciseService.list()]).then(([workoutResponse, exerciseResponse]) => { setWorkouts(workoutResponse.data); setExercises(exerciseResponse.data); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load insights')).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading label="Building your insights..." />;
  if (error) return <ApiState message={error} />;
  const today = new Date();
  const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay()); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const workoutDate = (workout: Workout) => workout.date || workout.createdAt;
  const isSameDay = (value: string | undefined, date: Date) => value ? new Date(value).toDateString() === date.toDateString() : false;
  const weekly = workouts.filter((workout) => workoutDate(workout) && new Date(workoutDate(workout) as string) >= startOfWeek);
  const monthly = workouts.filter((workout) => workoutDate(workout) && new Date(workoutDate(workout) as string) >= startOfMonth);
  const calories = weekly.reduce((sum, workout) => sum + (workout.totalCalories || 0), 0);
  const muscleGroups = exercises.reduce<Record<string, number>>((groups, exercise) => { groups[exercise.muscleGroup] = (groups[exercise.muscleGroup] || 0) + 1; return groups; }, {});
  const maxGroupCount = Math.max(...Object.values(muscleGroups), 1);
  const weekDays = Array.from({ length: 7 }, (_, index) => { const date = new Date(startOfWeek); date.setDate(startOfWeek.getDate() + index); return { label: dayFormatter.format(date), value: workouts.filter((workout) => isSameDay(workoutDate(workout), date)).reduce((sum, workout) => sum + (workout.totalCalories || 0), 0) }; });
  return <section className="mt-10 space-y-6"><div className="grid gap-4 sm:grid-cols-3"><Metric label="Today" value={workouts.filter((workout) => isSameDay(workout.createdAt, today)).length} detail="workouts" /><Metric label="This week" value={weekly.length} detail={`${calories} kcal estimated`} /><Metric label="This month" value={monthly.length} detail="workouts logged" /></div><div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"><div className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-mint">Weekly rhythm</p><h2 className="mt-2 text-2xl font-black">Calorie burn</h2></div><span className="text-sm font-bold text-slate-500">{calories} kcal</span></div><div className="mt-8 flex h-48 items-end gap-3 border-b border-slate-200">{weekDays.map((day) => <div key={day.label} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md bg-mint/80 transition-all" style={{ height: `${Math.max((day.value / Math.max(...weekDays.map((item) => item.value), 1)) * 100, day.value ? 8 : 2)}%` }} title={`${day.value} kcal`} /><span className="text-xs font-semibold text-slate-500">{day.label}</span></div>)}</div></div><div className="rounded-2xl bg-ink p-6 text-white"><p className="text-sm font-bold uppercase tracking-widest text-lime">Exercise balance</p><h2 className="mt-2 text-2xl font-black">Muscle groups</h2><div className="mt-6 space-y-4">{Object.keys(muscleGroups).length ? Object.entries(muscleGroups).map(([group, count]) => <div key={group}><div className="mb-1 flex justify-between text-sm"><span className="capitalize">{group}</span><span className="text-slate-300">{count}</span></div><div className="h-2 rounded-full bg-slate-700"><div className="h-2 rounded-full bg-lime" style={{ width: `${(count / maxGroupCount) * 100}%` }} /></div></div>) : <p className="text-sm text-slate-300">Add exercises to see your balance.</p>}</div><Link href="/exercises" className="mt-6 inline-block text-sm font-bold text-lime">Manage exercise library →</Link></div></div></section>;
}
function Metric({ label, value, detail }: { label: string; value: number; detail: string }) { return <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-slate-500">{label}</p><p className="mt-3 text-4xl font-black text-ink">{value}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></div>; }
