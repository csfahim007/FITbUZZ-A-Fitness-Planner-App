import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const nutritionApi = createApi({
  reducerPath: 'nutritionApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_BASE_URL ? 
      import.meta.env.VITE_API_BASE_URL + '/api/nutrition' : 
      '/api/nutrition', // Use proxy when VITE_API_BASE_URL is empty
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Fixed: was lowercase 'authorization'
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Nutrition'],
  endpoints: (builder) => ({
    getNutritionLogs: builder.query({
      query: (date) => `?date=${date}`,
      providesTags: ['Nutrition'],
      transformResponse: (response) => {
        console.log('Nutrition API Response:', response);
        return response?.data || response || [];
      },
      transformErrorResponse: (response) => {
        console.error('Nutrition API Error:', response);
        return {
          status: response.status,
          message: response.data?.message || 'Failed to fetch nutrition logs'
        };
      }
    }),
    logNutrition: builder.mutation({
      query: (entry) => ({
        url: '',
        method: 'POST',
        body: entry,
      }),
      invalidatesTags: ['Nutrition'],
      transformResponse: (response) => response?.data || response
    }),
    updateNutritionLog: builder.mutation({
      query: ({ id, ...entry }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: entry,
      }),
      invalidatesTags: ['Nutrition'],
      transformResponse: (response) => response?.data || response
    }),
    deleteNutritionLog: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Nutrition'],
      transformResponse: (response) => response?.data || response
    }),
  }),
});

export const {
  useGetNutritionLogsQuery,
  useLogNutritionMutation,
  useUpdateNutritionLogMutation,
  useDeleteNutritionLogMutation
} = nutritionApi;