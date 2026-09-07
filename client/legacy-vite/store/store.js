import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { workoutApi } from '../api/workoutApi';
import { exerciseApi } from '../api/exerciseApi';
import { nutritionApi } from '../api/nutritionApi'; // ADD THIS IMPORT
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [workoutApi.reducerPath]: workoutApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
    [nutritionApi.reducerPath]: nutritionApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(workoutApi.middleware)
      .concat(exerciseApi.middleware)
      .concat(nutritionApi.middleware), 
});

export default store;