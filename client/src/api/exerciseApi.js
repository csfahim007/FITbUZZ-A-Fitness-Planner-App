// exerciseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exerciseApi = createApi({
  reducerPath: 'exerciseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ? 
      import.meta.env.VITE_API_BASE_URL + '/api/exercises' : 
      '/api/exercises',
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
  tagTypes: ['Exercise'],
  endpoints: (builder) => ({
    getExercises: builder.query({
      query: () => ({
        url: '',
        method: 'GET'
      }),
      providesTags: ['Exercise'],
      transformResponse: (response) => {
        console.log('Get exercises response:', response);
        return response?.data || [];
      },
      transformErrorResponse: (response) => {
        console.error('Exercise API Error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to fetch exercises',
          data: null
        };
      }
    }),
    getExercise: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'Exercise', id }],
      transformResponse: (response) => {
        console.log('Get exercise response:', response);
        return response?.data || response;
      }
    }),
    createExercise: builder.mutation({
      query: (exercise) => {
        console.log('Creating exercise with data:', exercise);
        return {
          url: '',
          method: 'POST',
          body: exercise
        };
      },
      invalidatesTags: ['Exercise'],
      transformResponse: (response) => {
        console.log('Create exercise response:', response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error('Create exercise error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to create exercise',
          data: response.data || null
        };
      }
    }),
    updateExercise: builder.mutation({
      query: ({ id, ...exercise }) => {
        console.log('Updating exercise:', id, exercise);
        return {
          url: `/${id}`,
          method: 'PUT',
          body: exercise
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Exercise', id }, 'Exercise'],
      transformResponse: (response) => {
        console.log('Update exercise response:', response);
        return response?.data || response;
      }
    }),
    deleteExercise: builder.mutation({
      query: (id) => {
        console.log('Deleting exercise:', id);
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Exercise'],
      transformResponse: (response) => {
        console.log('Delete exercise response:', response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error('Delete exercise error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to delete exercise',
          data: response.data || null
        };
      }
    })
  })
});

export const { 
  useGetExercisesQuery, 
  useGetExerciseQuery, 
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation
} = exerciseApi;