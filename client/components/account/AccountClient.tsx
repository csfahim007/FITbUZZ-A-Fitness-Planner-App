'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { PageHeader } from '@/components/ui/PageHeader';
import { ApiError } from '@/lib/api/client';
import { authService } from '@/lib/api/services';
import type { FitnessGoal, User } from '@/types/domain';

type ProfileForm = {
  name: string;
  email: string;
  fitnessGoal: FitnessGoal | '';
  age: string;
  weight: string;
  height: string;
  activityLevel: NonNullable<User['activityLevel']>;
  notifications: NonNullable<User['notifications']>;
};

const initialNotifications = { workoutReminders: true, nutritionTips: true, progressUpdates: true, emailUpdates: false };

export function AccountClient() {
  const { user, updateUser, deleteAccount } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [profile, setProfile] = useState<ProfileForm>(() => ({ name: user?.name ?? '', email: user?.email ?? '', fitnessGoal: user?.fitnessGoal ?? '', age: String(user?.age ?? ''), weight: String(user?.weight ?? ''), height: String(user?.height ?? ''), activityLevel: user?.activityLevel ?? 'moderate', notifications: user?.notifications ?? initialNotifications }));
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateProfileField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) { setProfile((current) => ({ ...current, [key]: value })); }
  function updateNotification(key: keyof ProfileForm['notifications'], value: boolean) { setProfile((current) => ({ ...current, notifications: { ...current.notifications, [key]: value } })); }

  async function saveProfile(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const response = await authService.updateProfile({ ...profile, fitnessGoal: profile.fitnessGoal || undefined, age: profile.age ? Number(profile.age) : undefined, weight: profile.weight ? Number(profile.weight) : undefined, height: profile.height ? Number(profile.height) : undefined });
      updateUser(response.data); setMessage('Profile updated successfully.');
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Unable to update profile.'); } finally { setSaving(false); }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    if (password.newPassword.length < 6) { setError('The new password must be at least 6 characters.'); return; }
    if (password.newPassword !== password.confirmPassword) { setError('Passwords do not match.'); return; }
    setSaving(true);
    try { await authService.changePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword }); setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage('Password changed successfully.'); } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Unable to change password.'); } finally { setSaving(false); }
  }

  async function removeAccount() { if (!window.confirm('Delete your account and sign out? This cannot be undone.')) return; setSaving(true); try { await deleteAccount(); router.replace('/'); } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Unable to delete account.'); setSaving(false); } }

  return <div className="content-container py-12"><PageHeader eyebrow="Account" title="Your profile" description="Manage your identity, security, and planning preferences." /><div className="mb-6 flex flex-wrap gap-2">{(['profile', 'security', 'preferences'] as const).map((item) => <button key={item} type="button" onClick={() => { setTab(item); setMessage(''); setError(''); }} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${tab === item ? 'bg-ink text-white' : 'bg-white text-slate-600'}`}>{item}</button>)}</div>{error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}{message && <p className="mb-5 rounded-lg bg-lime/30 p-4 text-sm text-mint">{message}</p>}{tab === 'profile' && <form onSubmit={saveProfile} className="grid max-w-2xl gap-5 rounded-2xl bg-white p-7 shadow-sm sm:grid-cols-2"><Field label="Name" value={profile.name} onChange={(value) => updateProfileField('name', value)} /><Field label="Email" type="email" value={profile.email} onChange={(value) => updateProfileField('email', value)} /><Select label="Fitness goal" value={profile.fitnessGoal} onChange={(value) => updateProfileField('fitnessGoal', value as ProfileForm['fitnessGoal'])} options={['', 'general_fitness', 'weight_loss', 'muscle_gain', 'endurance', 'strength']} /><Select label="Activity level" value={profile.activityLevel} onChange={(value) => updateProfileField('activityLevel', value as ProfileForm['activityLevel'])} options={['sedentary', 'light', 'moderate', 'active', 'very_active']} /><Field label="Age" type="number" value={profile.age} onChange={(value) => updateProfileField('age', value)} /><Field label="Weight (kg)" type="number" value={profile.weight} onChange={(value) => updateProfileField('weight', value)} /><Field label="Height (cm)" type="number" value={profile.height} onChange={(value) => updateProfileField('height', value)} /><button disabled={saving} className="rounded-lg bg-mint px-5 py-3 font-bold text-white disabled:opacity-60 sm:col-span-2">{saving ? 'Saving...' : 'Save profile'}</button></form>}{tab === 'security' && <form onSubmit={changePassword} className="max-w-xl rounded-2xl bg-white p-7 shadow-sm"><Field label="Current password" type="password" value={password.currentPassword} onChange={(value) => setPassword((current) => ({ ...current, currentPassword: value }))} /><div className="mt-5"><Field label="New password" type="password" value={password.newPassword} onChange={(value) => setPassword((current) => ({ ...current, newPassword: value }))} /></div><div className="mt-5"><Field label="Confirm new password" type="password" value={password.confirmPassword} onChange={(value) => setPassword((current) => ({ ...current, confirmPassword: value }))} /></div><button disabled={saving} className="mt-6 rounded-lg bg-mint px-5 py-3 font-bold text-white disabled:opacity-60">{saving ? 'Updating...' : 'Change password'}</button><button type="button" disabled={saving} onClick={removeAccount} className="mt-8 block text-sm font-bold text-red-600">Delete account</button></form>}{tab === 'preferences' && <div className="max-w-xl rounded-2xl bg-white p-7 shadow-sm"><h2 className="text-xl font-black">Notifications</h2>{(Object.keys(profile.notifications) as Array<keyof ProfileForm['notifications']>).map((key) => <label key={key} className="mt-5 flex items-center justify-between gap-4 text-sm font-semibold capitalize text-slate-700"><span>{key.replace(/([A-Z])/g, ' $1')}</span><input type="checkbox" checked={profile.notifications[key]} onChange={(event) => updateNotification(key, event.target.checked)} className="h-5 w-5 accent-mint" /></label>)}<button type="button" onClick={() => void saveProfile({ preventDefault: () => undefined } as FormEvent)} className="mt-7 rounded-lg bg-mint px-5 py-3 font-bold text-white">Save preferences</button></div>}</div>;
}

function Field({ label, type = 'text', value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-slate-700">{label}<input required={label === 'Name' || label === 'Email'} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-mint focus:ring-2 focus:ring-lime/50" /></label>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-slate-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3">{options.map((option) => <option key={option} value={option}>{option ? option.replace('_', ' ') : 'Not set'}</option>)}</select></label>; }
