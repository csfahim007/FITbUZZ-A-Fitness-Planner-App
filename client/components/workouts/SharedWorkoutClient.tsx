'use client';

import { useEffect, useState } from 'react';
import { shareService } from '@/lib/api/services';
import type { Workout } from '@/types/domain';
import { Loading } from '@/components/ui/Loading';
import { ApiState } from '@/components/ui/ApiState';

export function SharedWorkoutClient({ id }: { id: string }) { const [workout, setWorkout] = useState<Workout | null>(null); const [error, setError] = useState(''); useEffect(() => { shareService.getWorkout(id).then(setWorkout).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load shared workout')); }, [id]); if (!workout && !error) return <Loading label="Loading shared workout..." />; if (error) return <div className="content-container py-16"><ApiState message={error} /></div>; return <div className="content-container max-w-3xl py-16"><p className="text-sm font-bold uppercase tracking-widest text-mint">Shared workout</p><h1 className="mt-3 text-4xl font-black">{workout?.name}</h1><p className="mt-3 text-slate-600">{workout?.exercises.length || 0} exercises</p><section className="mt-8 rounded-2xl bg-white p-7 shadow-sm"><div className="space-y-3">{workout?.exercises.map((item, index) => <div key={`${index}-${typeof item.exercise === 'string' ? item.exercise : item.exercise._id}`} className="flex justify-between rounded-lg bg-slate-50 p-4"><span className="font-semibold">{typeof item.exercise === 'string' ? item.exercise : item.exercise.name}</span><span className="text-sm text-slate-500">{item.sets} sets × {item.reps} reps</span></div>)}</div></section></div>; }
