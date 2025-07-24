// workoutApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workoutApi = createApi({
  reducerPath: 'workoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ? 
      import.meta.env.VITE_API_BASE_URL + '/api/workouts' : 
      '/api/workouts',
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
      transformResponse: (response) => {
        console.log('Get workouts response:', response);
        return response?.data || [];
      },
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
      query: (id) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'Workout', id }],
      transformResponse: (response) => {
        console.log('Get workout response:', response);
        return response?.data || response;
      }
    }),
    createWorkout: builder.mutation({
      query: (workout) => {
        console.log('Creating workout with data:', workout);
        return {
          url: '',
          method: 'POST',
          body: workout
        };
      },
      invalidatesTags: ['Workout'],
      transformResponse: (response) => {
        console.log('Create workout response:', response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error('Create workout error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to create workout',
          data: response.data || null
        };
      }
    }),
    updateWorkout: builder.mutation({
      query: ({ id, ...workout }) => {
        console.log('Updating workout:', id, workout);
        return {
          url: `/${id}`,
          method: 'PUT',
          body: workout
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Workout', id }, 'Workout'],
      transformResponse: (response) => {
        console.log('Update workout response:', response);
        return response?.data || response;
      }
    }),
    deleteWorkout: builder.mutation({
      query: (id) => {
        console.log('Deleting workout:', id);
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Workout'],
      transformResponse: (response) => {
        console.log('Delete workout response:', response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error('Delete workout error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to delete workout',
          data: response.data || null
        };
      }
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