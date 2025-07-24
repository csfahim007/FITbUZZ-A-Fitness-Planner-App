import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_BASE_URL ? 
      import.meta.env.VITE_API_BASE_URL + '/api/auth' : 
      '/api/auth', // Use proxy when VITE_API_BASE_URL is empty
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Don't set Content-Type for FormData (file uploads)
      if (!headers.get('formData')) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        return { error: 'Invalid JSON response', rawBody: text };
      }
    }
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      transformErrorResponse: (response) => ({
        status: response.status,
        data: {
          message: response.data?.message || 'Registration failed',
          errors: response.data?.errors || {},
          success: response.data?.success || false
        }
      })
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response) => ({
        status: response.status,
        data: {
          message: response.data?.message || 'Login failed',
          errors: response.data?.errors || {}
        }
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => '/me',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation({
  query: (profileData) => ({
    url: '/me',
    method: 'PUT',
    body: profileData,
  }),
  invalidatesTags: ['User'],
  transformResponse: (response) => {
    console.log('Update profile response:', response);
    return response;
  },
  transformErrorResponse: (response) => {
    console.error('Update profile error:', response);
    return {
      status: response.status,
      data: {
        message: response.data?.message || 'Failed to update profile',
        errors: response.data?.errors || {},
      },
    };
  },
}),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/change-password',
        method: 'PUT',
        body: passwordData,
      }),
      transformResponse: (response) => {
        console.log('Change password response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Change password error:', response);
        return {
          status: response.status,
          data: {
            message: response.data?.message || 'Failed to change password',
            errors: response.data?.errors || {}
          }
        };
      }
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/delete-account',
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        console.log('Delete account response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Delete account error:', response);
        return {
          status: response.status,
          data: {
            message: response.data?.message || 'Failed to delete account',
            errors: response.data?.errors || {}
          }
        };
      }
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/upload-avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
      transformResponse: (response) => {
        console.log('Upload avatar response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Upload avatar error:', response);
        return {
          status: response.status,
          data: {
            message: response.data?.message || 'Failed to upload avatar',
            errors: response.data?.errors || {}
          }
        };
      }
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUploadAvatarMutation,
} = authApi;