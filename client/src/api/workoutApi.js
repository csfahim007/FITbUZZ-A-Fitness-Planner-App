// workoutApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workoutApi = createApi({
  reducerPath: 'workoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ? 
      import.meta.env.VITE_API_BASE_URL + '/api/workouts' : 
      '/api/workouts', // Use proxy when VITE_API_BASE_URL is empty
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Workout'],
  endpoints: (builder) => ({
    getWorkouts: builder.query({
      query: () => ({
        url: '',
        method: 'GET'
      }),
      providesTags: ['Workout'],
      transformResponse: (response) => response?.data || [],
      transformErrorResponse: (response) => {
        console.error('Workout API Error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to fetch workouts',
          data: null
        };
      }
    }),
    getWorkout: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workout', id }],
      transformResponse: (response) => response?.data || response
    }),
    createWorkout: builder.mutation({
      query: (workout) => ({
        url: '',
        method: 'POST',
        body: workout
      }),
      invalidatesTags: ['Workout'],
      transformResponse: (response) => response?.data || response
    }),
    updateWorkout: builder.mutation({
      query: ({ id, ...workout }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: workout
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workout', id }],
      transformResponse: (response) => response?.data || response
    }),
    deleteWorkout: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Workout'],
      transformResponse: (response) => response?.data || response
    })
  })
});

export const { 
  useGetWorkoutsQuery,
  useGetWorkoutQuery,
  useCreateWorkoutMutation,
  useUpdateWorkoutMutation,
  useDeleteWorkoutMutation
} = workoutApi;