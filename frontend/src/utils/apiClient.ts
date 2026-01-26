import { useGlobalState } from '@/composables/useGlobalState';

export class ApiError<T = unknown> extends Error {
  status: number;
  payload: T | null;

  constructor(message: string, status: number, payload: T | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

type ApiSuccessEnvelope<T> = {
  status: 'success';
  data: T;
  message?: string | null;
};

type ApiErrorEnvelope = {
  status: 'error';
  message: string;
  errors?: Record<string, unknown> | string | null;
  data?: Record<string, unknown> | null;
};

type RequestOptions = {
  method?: 'GET' | 'POST';
  headers?: HeadersInit;
  body?: BodyInit | Record<string, unknown>;
  includeCsrf?: boolean;
  signal?: AbortSignal;
};

export type ApiResult<T> = {
  data: T;
  message: string | null;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

const isErrorEnvelope = (payload: unknown): payload is ApiErrorEnvelope =>
  isPlainObject(payload) && payload.status === 'error' && typeof payload.message === 'string';

const isSuccessEnvelope = <T>(payload: unknown): payload is ApiSuccessEnvelope<T> =>
  isPlainObject(payload) && payload.status === 'success' && 'data' in payload;

const getCsrfToken = () => {
  try {
    const { csrfToken } = useGlobalState();
    return csrfToken.value;
  } catch {
    return null;
  }
};

const appendCsrf = (body: RequestOptions['body'], includeCsrf: boolean) => {
  const token = includeCsrf ? getCsrfToken() : null;

  if (!includeCsrf || !token) {
    return body;
  }

  if (body instanceof FormData) {
    body.append(token.name, token.value);
    return body;
  }

  if (isPlainObject(body)) {
    return {
      ...body,
      [token.name]: token.value,
    };
  }

  return body;
};

async function request<T>(url: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const headers = new Headers({ Accept: 'application/json' });
  if (options.headers) {
    new Headers(options.headers).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const shouldIncludeCsrf = options.includeCsrf ?? true;
  let body = appendCsrf(options.body, shouldIncludeCsrf);

  if (isPlainObject(body)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: body as BodyInit | undefined,
    signal: options.signal,
  });

  const contentType = response.headers.get('Content-Type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (isPlainObject(payload) && typeof payload.message === 'string'
        ? payload.message
        : response.statusText) || 'Request failed';
    throw new ApiError(message, response.status, payload);
  }

  if (isErrorEnvelope(payload)) {
    throw new ApiError(payload.message, response.status, payload);
  }

  if (isSuccessEnvelope<T>(payload)) {
    return {
      data: payload.data,
      message: payload.message ?? null,
    };
  }

  return {
    data: payload as T,
    message: null,
  };
}

export const apiClient = {
  get<T>(url: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(url, { ...options, method: 'GET' });
  },
  postJson<T>(
    url: string,
    body: Record<string, unknown>,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ) {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  },
  postForm<T>(url: string, form: FormData, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: form,
    });
  },
};
