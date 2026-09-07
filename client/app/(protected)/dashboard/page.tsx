'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { PageHeader } from '@/components/ui/PageHeader';
import { Loading } from '@/components/ui/Loading';
import { ApiState } from '@/components/ui/ApiState';
import { exerciseService, workoutService } from '@/lib/api/services';
import type { Exercise, Workout } from '@/types/domain';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';

export default function DashboardPage() { const { user } = useAuth(); const [workouts, setWorkouts] = useState<Workout[]>([]); const [exercises, setExercises] = useState<Exercise[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { Promise.all([workoutService.list(), exerciseService.list()]).then(([workoutResponse, exerciseResponse]) => { setWorkouts(workoutResponse.data); setExercises(exerciseResponse.data); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load dashboard')).finally(() => setLoading(false)); }, []); if (loading) return <Loading />; return <div className="content-container py-12"><PageHeader eyebrow="Your dashboard" title={`Good to see you, ${user?.name.split(' ')[0]}.`} description="A quick read on the work you have set up and the next useful action." action={<Link href="/workouts/new" className="rounded-lg bg-mint px-5 py-3 text-sm font-bold text-white">New workout</Link>} />{error ? <ApiState message={error} /> : <><div className="grid gap-5 sm:grid-cols-3"><Stat label="Workouts" value={workouts.length} /><Stat label="Exercises" value={exercises.length} /><Stat label="Goal" value={user?.fitnessGoal?.replace('_', ' ') || 'Set a goal'} /></div><section className="mt-10 rounded-2xl border border-slate-200 bg-slate-100 p-8 text-slate-900 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-mint">Keep momentum</p><h2 className="mt-3 max-w-xl text-3xl font-black">Your plan only needs to be clear enough for the next session.</h2><Link href="/workouts" className="mt-6 inline-block font-bold text-ink hover:text-mint">Review workouts →</Link></section><DashboardInsights /></>}</div>; }
function Stat({ label, value }: { label: string; value: string | number | undefined }) { return <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black capitalize text-ink">{value}</p></div>; }
