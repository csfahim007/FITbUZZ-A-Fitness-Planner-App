// exerciseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exerciseApi = createApi({
  reducerPath: 'exerciseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ? 
      import.meta.env.VITE_API_BASE_URL + '/api/exercises' : 
      '/api/exercises', // Use proxy when VITE_API_BASE_URL is empty
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
      transformResponse: (response) => response?.data || [],
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
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exercise', id }],
      transformResponse: (response) => response?.data || response
    }),
    createExercise: builder.mutation({
      query: (exercise) => ({
        url: '',
        method: 'POST',
        body: exercise
      }),
      invalidatesTags: ['Exercise'],
      transformResponse: (response) => response?.data || response
    })
  })
});

export const { 
  useGetExercisesQuery, 
  useGetExerciseQuery, 
  useCreateExerciseMutation 
} = exerciseApi;
