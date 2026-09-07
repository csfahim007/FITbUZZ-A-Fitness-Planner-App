import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentWorkout: null,
  status: 'idle',
  error: null
};

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    setCurrentWorkout: (state, action) => {
      state.currentWorkout = action.payload;
    },
    resetWorkoutState: () => initialState
  }
});

export const { setCurrentWorkout, resetWorkoutState } = workoutsSlice.actions;
export default workoutsSlice.reducer;