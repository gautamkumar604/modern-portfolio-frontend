import { ApiErrorResponse } from '@/types';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

export class ApiError extends Error {
  public statusCode: number;
  public error?: string;
  public details?: string | string[];

  constructor(statusCode: number, message: string | string[], error?: string) {
    const formattedMessage = Array.isArray(message)
      ? message.join(', ')
      : message;
    super(formattedMessage);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.details = message;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  withCredentials?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, withCredentials = false, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (withCredentials) {
    config.credentials = 'include';
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return {} as T;
    }

    let data: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new ApiError(
        response.status,
        errorData.message || 'An unexpected error occurred',
        errorData.error || response.statusText,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      'Unable to connect to portfolio backend API. Please ensure backend service is running.',
      'NetworkError',
    );
  }
}

export const apiClient = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions,
  ) => request<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};
