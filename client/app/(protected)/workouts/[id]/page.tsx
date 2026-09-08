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
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

function toDateLabel(value?: string) {
  const dateValue = toDateInputValue(value);
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString();
}

function estimateExerciseCalories(entry: WorkoutExercise) {
  const exercise = typeof entry.exercise === 'string' ? null : entry.exercise;
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

  useEffect(() => {
    if (!id) return;

    Promise.all([workoutService.get(id), exerciseService.list()])
      .then(([workoutResponse, exerciseResponse]) => {
        setItem(workoutResponse.data);
        setExerciseOptions(exerciseResponse.data);
        if (exerciseResponse.data[0]) {
          setSelectedExerciseId(exerciseResponse.data[0]._id);
        }
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : 'Unable to load workout');
      });
  }, [id]);

  async function persistWorkout(nextExercises: WorkoutExercise[]) {
    if (!item || !id) return;

    setSaving(true);
    try {
      const response = await workoutService.update(id, {
        exercises: nextExercises,
        date: item.date || new Date().toISOString(),
      });
      setItem(response.data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save workout');
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
        completed: false,
        completedAt: undefined,
        caloriesBurned: 0,
      },
    ];

    await persistWorkout(nextExercises);
    setDraftSets('3');
    setDraftReps('10');
    setDraftWeight('0');
  }

  async function updateExerciseEntry(index: number, patch: Partial<WorkoutExercise>) {
    if (!item) return;

    const nextExercises = item.exercises.map((entry, entryIndex) => {
      if (entryIndex !== index) return entry;
      return { ...entry, ...patch };
    });

    await persistWorkout(nextExercises);
  }

  if (!item && !error) return <Loading />;
  if (error) return <div className="content-container py-12"><ApiState message={error} /></div>;

  const availableExercises = exerciseOptions.filter((exercise) =>
    !(item?.exercises ?? []).some((entry) => {
      const id = typeof entry.exercise === 'string' ? entry.exercise : entry.exercise._id;
      return id === exercise._id;
    }),
  );

  return (
    <div className="content-container py-12">
      <Link href="/workouts" className="text-sm font-bold text-mint">
        ← Back to workouts
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-900 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-mint">Workout plan</p>
        <h1 className="mt-3 text-4xl font-black">{item?.name}</h1>
        <p className="mt-3 text-slate-600">
          {item?.exercises.length || 0} exercises · {item?.totalCalories || 0} completed calories
          {item?.date ? ` · ${toDateLabel(item.date)}` : ''}
        </p>

        <label className="mt-5 block max-w-xs text-sm font-semibold text-slate-700">
          Workout date
          <input
            type="date"
            value={toDateInputValue(item?.date)}
            onChange={async (event) => {
              if (!item) return;
              const response = await workoutService.update(id, {
                date: event.target.value,
                exercises: item.exercises,
              });
              setItem(response.data);
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
          <h2 className="text-xl font-black">Exercises</h2>
          <span className="text-sm text-slate-500">{saving ? 'Saving...' : 'Ready'}</span>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Exercise
              <select
                value={selectedExerciseId}
                onChange={(event) => setSelectedExerciseId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                {availableExercises.length === 0 ? (
                  <option value="">No more exercises available</option>
                ) : (
                  <>
                    <option value="">Select an exercise</option>
                    {availableExercises.map((exercise) => (
                      <option key={exercise._id} value={exercise._id}>
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
                onChange={(event) => setDraftSets(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Reps
              <input
                type="number"
                min="0"
                value={draftReps}
                onChange={(event) => setDraftReps(event.target.value)}
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
                onChange={(event) => setDraftWeight(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => void addExercise()}
            disabled={!selectedExerciseId || availableExercises.length === 0}
            className="mt-4 rounded-lg bg-mint px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add exercise
          </button>
        </div>

        {item?.exercises.length ? (
          <div className="mt-5 space-y-4">
            {item.exercises.map((entry, index) => {
              const exerciseDetails = typeof entry.exercise === 'string' ? exerciseOptions.find((exercise) => exercise._id === entry.exercise) : entry.exercise;
              const estimatedCalories = estimateExerciseCalories(entry);

              return (
                <div key={`${index}-${typeof entry.exercise === 'string' ? entry.exercise : entry.exercise._id}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{exerciseDetails?.name || 'Exercise'}</p>
                      <p className="text-sm text-slate-500">
                        Estimated burn: {estimatedCalories} kcal
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(entry.completed)}
                        onChange={(event) =>
                          void updateExerciseEntry(index, {
                            completed: event.target.checked,
                            completedAt: event.target.checked ? new Date().toISOString() : undefined,
                            caloriesBurned: event.target.checked ? Number(entry.caloriesBurned || estimatedCalories) : 0,
                          })
                        }
                      />
                      Done
                    </label>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-5">
                    <label className="text-sm font-semibold text-slate-700">
                      Sets
                      <input
                        type="number"
                        min="0"
                        value={entry.sets ?? 0}
                        onChange={(event) =>
                          void updateExerciseEntry(index, {
                            sets: Number(event.target.value) || 0,
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Reps
                      <input
                        type="number"
                        min="0"
                        value={entry.reps ?? 0}
                        onChange={(event) =>
                          void updateExerciseEntry(index, {
                            reps: Number(event.target.value) || 0,
                          })
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
                        value={entry.weight ?? 0}
                        onChange={(event) =>
                          void updateExerciseEntry(index, {
                            weight: Number(event.target.value) || 0,
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Burned (kcal)
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={entry.caloriesBurned ?? 0}
                        onChange={(event) =>
                          void updateExerciseEntry(index, {
                            caloriesBurned: Number(event.target.value) || 0,
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Done date
                      <input
                        type="date"
                        value={entry.completedAt ? toDateInputValue(entry.completedAt) : new Date().toISOString().slice(0, 10)}
                        onChange={(event) =>
                          void updateExerciseEntry(index, {
                            completedAt: event.target.value,
                            completed: true,
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-slate-500">No exercises added yet.</p>
        )}
      </section>
    </div>
  );
}
