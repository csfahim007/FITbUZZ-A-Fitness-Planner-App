export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'general_fitness';

export interface User {
  _id: string;
  name: string;
  email: string;
  fitnessGoal?: FitnessGoal;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  notifications?: {
    workoutReminders: boolean;
    nutritionTips: boolean;
    progressUpdates: boolean;
    emailUpdates: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  data: User & { token: string };
}

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  instructions?: string;
  caloriesPerRep?: number;
}

export interface WorkoutExercise {
  exercise: Exercise | string;
  sets: number;
  reps: number;
  completed?: boolean;
  completedAt?: string;
  caloriesBurned?: number;
  weight?: number;
}

export interface Workout {
  _id: string;
  name: string;
  exercises: WorkoutExercise[];
  totalCalories?: number;
  date?: string;
  createdAt?: string;
}

export interface NutritionLog {
  _id: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorPayload {
  message: string;
  errors?: Record<string, string>;
}
