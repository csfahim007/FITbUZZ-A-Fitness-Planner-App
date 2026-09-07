import type { ApiErrorPayload } from '@/types/domain';

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export class ApiError extends Error {
  status: number;
  details?: ApiErrorPayload;

  constructor(status: number, details: ApiErrorPayload) {
    super(details.message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const details: ApiErrorPayload = typeof payload === 'string'
      ? { message: payload || 'Request failed' }
      : { message: payload?.message || 'Request failed', errors: payload?.errors };
    throw new ApiError(response.status, details);
  }

  return payload as T;
}
