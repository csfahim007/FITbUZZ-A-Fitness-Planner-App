'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { workoutService } from '@/lib/api/services';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NewWorkoutPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await workoutService.create({
        name,
        exercises: [],
        date,
      });
      router.replace(`/workouts/${response.data._id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create workout');
      setSaving(false);
    }
  }

  return (
    <div className="content-container py-12">
      <PageHeader
        eyebrow="New plan"
        title="Create a workout"
        description="Start with a name and date; exercises can be added once the plan is live."
      />

      <form onSubmit={submit} className="max-w-xl rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-semibold">
          Workout name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="mt-5 block text-sm font-semibold">
          Workout date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          disabled={saving}
          className="mt-6 rounded-lg bg-mint px-5 py-3 font-bold text-white disabled:opacity-60"
        >
          {saving ? 'Creating...' : 'Create workout'}
        </button>
      </form>
    </div>
  );
}
