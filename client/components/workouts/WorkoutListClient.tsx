'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { workoutService } from '@/lib/api/services';
import type { Workout } from '@/types/domain';
import { PageHeader } from '@/components/ui/PageHeader';
import { Loading } from '@/components/ui/Loading';
import { ApiState } from '@/components/ui/ApiState';

export function WorkoutListClient() {
  const [items, setItems] = useState<Workout[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [editingId, setEditingId] = useState<string | null>(null); const [editingName, setEditingName] = useState('');
  const load = () => { setLoading(true); workoutService.list().then((response) => setItems(response.data)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load workouts')).finally(() => setLoading(false)); };
  useEffect(load, []);
  async function remove(id: string) { if (!window.confirm('Delete this workout?')) return; try { await workoutService.remove(id); setItems((current) => current.filter((item) => item._id !== id)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to delete workout'); } }
  async function save(id: string) { if (!editingName.trim()) return; try { const response = await workoutService.update(id, { name: editingName.trim() }); setItems((current) => current.map((item) => item._id === id ? response.data : item)); setEditingId(null); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update workout'); } }
  if (loading) return <Loading />;
  return <div className="content-container py-12"><PageHeader eyebrow="Training library" title="Workouts" description="Keep your repeatable sessions organized and ready to run." action={<Link href="/workouts/new" className="rounded-lg bg-mint px-5 py-3 text-sm font-bold text-white">New workout</Link>} />{error ? <ApiState message={error} onRetry={load} /> : items.length === 0 ? <Empty href="/workouts/new" label="Create your first workout" /> : <div className="grid gap-5 md:grid-cols-2">{items.map((item) => <article key={item._id} className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4">{editingId === item._id ? <input autoFocus value={editingName} onChange={(event) => setEditingName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void save(item._id); if (event.key === 'Escape') setEditingId(null); }} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xl font-black" /> : <div><h2 className="text-xl font-black">{item.name}</h2><p className="mt-2 text-sm text-slate-500">{item.exercises.length} exercise{item.exercises.length === 1 ? '' : 's'}{item.totalCalories ? ` · ${item.totalCalories} estimated calories` : ''}</p></div>}<span className="rounded-full bg-lime/40 px-3 py-1 text-xs font-bold text-mint">Ready</span></div><div className="mt-6 flex gap-4 text-sm font-bold">{editingId === item._id ? <><button type="button" onClick={() => void save(item._id)} className="text-mint">Save</button><button type="button" onClick={() => setEditingId(null)} className="text-slate-500">Cancel</button></> : <><Link href={`/workouts/${item._id}`} className="text-mint">Open</Link><button type="button" onClick={() => { setEditingId(item._id); setEditingName(item.name); }} className="text-slate-600">Edit</button><button type="button" onClick={() => void remove(item._id)} className="text-red-600">Delete</button></>}</div></article>)}</div>}</div>;
}
function Empty({ href, label }: { href: string; label: string }) { return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="text-slate-600">Nothing here yet.</p><Link href={href} className="mt-5 inline-block rounded-lg bg-mint px-5 py-3 font-bold text-white">{label}</Link></div>; }
