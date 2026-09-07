'use client';

import { useState } from 'react';
import { shareService } from '@/lib/api/services';
import { ApiError } from '@/lib/api/client';

export function ShareWorkout({ workoutId }: { workoutId: string }) {
  const [link, setLink] = useState(''); const [error, setError] = useState(''); const [copied, setCopied] = useState(false); const [loading, setLoading] = useState(false);
  async function generate() { setLoading(true); setError(''); try { const response = await shareService.createWorkoutLink(workoutId); setLink(response.shareLink); } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Unable to create share link.'); } finally { setLoading(false); } }
  async function copy() { if (!link) return; await navigator.clipboard.writeText(link); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  return <div className="mt-6 border-t border-slate-200 pt-6"><button type="button" onClick={() => void generate()} disabled={loading} className="rounded-lg border border-mint px-4 py-2 text-sm font-bold text-mint disabled:opacity-60">{loading ? 'Generating...' : 'Generate share link'}</button>{link && <div className="mt-3 flex gap-2"><input readOnly value={link} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs" /><button type="button" onClick={() => void copy()} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">{copied ? 'Copied' : 'Copy'}</button></div>}{error && <p className="mt-3 text-sm text-red-600">{error}</p>}</div>;
}
