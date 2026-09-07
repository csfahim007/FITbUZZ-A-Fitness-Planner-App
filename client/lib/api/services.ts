import { apiRequest } from '@/lib/api/client';
import type { ApiEnvelope, AuthResponse, Exercise, NutritionLog, User, Workout } from '@/types/domain';

const auth = '/api/auth';
const workouts = '/api/workouts';
const exercises = '/api/exercises';
const nutrition = '/api/nutrition';

export const authService = {
  login: (body: { email: string; password: string }) => apiRequest<AuthResponse>(`${auth}/login`, { method: 'POST', body: JSON.stringify(body) }),
  register: (body: { name: string; email: string; password: string; confirmPassword: string; fitnessGoal: string }) => apiRequest<AuthResponse>(`${auth}/register`, { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiRequest<ApiEnvelope<null>>(`${auth}/logout`, { method: 'POST' }),
  me: () => apiRequest<ApiEnvelope<User>>(`${auth}/me`),
  updateProfile: (body: Partial<Omit<User, '_id'>>) => apiRequest<ApiEnvelope<User>>(`${auth}/me`, { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body: { currentPassword: string; newPassword: string }) => apiRequest<ApiEnvelope<null>>(`${auth}/change-password`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAccount: () => apiRequest<ApiEnvelope<null>>(`${auth}/delete-account`, { method: 'DELETE' }),
  refresh: () => apiRequest<{ success: boolean; token: string }>(`${auth}/refresh`, { method: 'POST' }),
  stats: () => apiRequest<ApiEnvelope<{ totalWorkouts: number; daysActive: number; caloriesBurned: number; streakDays: number; joinDate?: string }>>(`${auth}/stats`),
  uploadAvatar: (body: FormData) => apiRequest<ApiEnvelope<{ avatarUrl: string }>>(`${auth}/upload-avatar`, { method: 'POST', body }),
};

export const workoutService = {
  list: () => apiRequest<ApiEnvelope<Workout[]>>(workouts),
  get: (id: string) => apiRequest<ApiEnvelope<Workout>>(`${workouts}/${id}`),
  create: (body: Pick<Workout, 'name' | 'exercises'>) => apiRequest<ApiEnvelope<Workout>>(workouts, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Pick<Workout, 'name' | 'exercises'>>) => apiRequest<ApiEnvelope<Workout>>(`${workouts}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<ApiEnvelope<null>>(`${workouts}/${id}`, { method: 'DELETE' }),
};

export const exerciseService = {
  list: () => apiRequest<ApiEnvelope<Exercise[]>>(exercises),
  get: (id: string) => apiRequest<ApiEnvelope<Exercise>>(`${exercises}/${id}`),
  create: (body: Omit<Exercise, '_id'>) => apiRequest<ApiEnvelope<Exercise>>(exercises, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Omit<Exercise, '_id'>>) => apiRequest<ApiEnvelope<Exercise>>(`${exercises}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<ApiEnvelope<null>>(`${exercises}/${id}`, { method: 'DELETE' }),
};

export const nutritionService = {
  list: (date?: string) => apiRequest<NutritionLog[]>(`${nutrition}${date ? `?date=${encodeURIComponent(date)}` : ''}`),
  create: (body: Omit<NutritionLog, '_id' | 'date'>) => apiRequest<NutritionLog>(nutrition, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Omit<NutritionLog, '_id' | 'date'>>) => apiRequest<NutritionLog>(`${nutrition}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<{ success: boolean }>(`${nutrition}/${id}`, { method: 'DELETE' }),
};

export const shareService = {
  createWorkoutLink: (id: string) => apiRequest<{ shareLink: string }>(`/api/share/workouts/${id}`, { method: 'POST' }),
  getWorkout: (id: string) => apiRequest<Workout>(`/api/share/workouts/${id}`),
};
