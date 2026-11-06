const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = /^https?:\/\//i.test(path)
    ? path
    : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!headers.has('Content-Type') && options.body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers, credentials: 'include' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(`Unable to reach the One Campus API at ${API_BASE}. ${message}`, 0, error);
  }

  const contentType = response.headers.get('content-type') || '';
  let data: any = null;
  if (contentType.includes('application/json')) {
    try { data = await response.json(); } catch { data = null; }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === 'object' && (data.error || data.message)) ||
      `HTTP error ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMessage, response.status, data);
  }
  return data as T;
}

export const api = {
  get<T = any>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  },
  post<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
  },
  patch<T = any>(path: string, body?: any, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined });
  },
  delete<T = any>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};

export default api;
