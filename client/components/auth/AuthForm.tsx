'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ApiError } from '@/lib/api/client';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setIsSubmitting(true);
    try { await login(email, password); router.replace(searchParams.get('from') || '/dashboard'); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Login failed. Please try again.'); }
    finally { setIsSubmitting(false); }
  }

  return <form onSubmit={submit} className="space-y-5"><Field label="Email" type="email" value={email} onChange={setEmail} /><Field label="Password" type="password" value={password} onChange={setPassword} />{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={isSubmitting} className="w-full rounded-lg bg-mint px-5 py-3 font-bold text-white disabled:opacity-60">{isSubmitting ? 'Signing in...' : 'Sign in'}</button><p className="text-center text-sm text-slate-600">New here? <Link href="/register" className="font-bold text-mint">Create an account</Link></p></form>;
}

export function RegisterForm() {
  const { register } = useAuth(); const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', fitnessGoal: 'general_fitness' });
  const [error, setError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; } setIsSubmitting(true); try { await register(form); router.replace('/dashboard'); } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Registration failed. Please try again.'); } finally { setIsSubmitting(false); } }
  return <form onSubmit={submit} className="space-y-5"><Field label="Full name" value={form.name} onChange={(value) => update('name', value)} /><Field label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} /><Field label="Password" type="password" value={form.password} onChange={(value) => update('password', value)} /><Field label="Confirm password" type="password" value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} /><label className="block text-sm font-semibold text-slate-700">Primary goal<select value={form.fitnessGoal} onChange={(event) => update('fitnessGoal', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"><option value="general_fitness">General fitness</option><option value="weight_loss">Weight loss</option><option value="muscle_gain">Muscle gain</option><option value="endurance">Endurance</option><option value="strength">Strength</option></select></label>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={isSubmitting} className="w-full rounded-lg bg-mint px-5 py-3 font-bold text-white disabled:opacity-60">{isSubmitting ? 'Creating account...' : 'Create account'}</button><p className="text-center text-sm text-slate-600">Already registered? <Link href="/login" className="font-bold text-mint">Sign in</Link></p></form>;
}

function Field({ label, type = 'text', value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-slate-700">{label}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-mint focus:ring-2 focus:ring-lime/50" /></label>; }
