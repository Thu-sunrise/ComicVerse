import { HttpError } from './HttpError';
import { createLogger, ILogger } from '../../utils';

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  getToken?: () => string | null | Promise<string | null>;
  defaultHeaders?: Record<string, string>;
  isDev?: boolean;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly getToken?: () => string | null | Promise<string | null>;
  private readonly defaultHeaders: Record<string, string>;
  private readonly logger: ILogger;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.timeoutMs = config.timeoutMs ?? 15000;
    this.getToken = config.getToken;
    this.defaultHeaders = config.defaultHeaders ?? {};
    this.logger = createLogger('ApiClient', config.isDev);
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async prepareHeaders(customHeaders?: HeadersInit): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...this.defaultHeaders,
      ...customHeaders,
    });

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, timeoutMs, signal, headers: customHeaders, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);
    const headers = await this.prepareHeaders(customHeaders);
    const timeout = timeoutMs ?? this.timeoutMs;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const mergedSignal = signal
      ? AbortSignal.any?.([signal, controller.signal]) ?? controller.signal
      : controller.signal;

    try {
      this.logger.debug(`FETCH [${fetchOptions.method || 'GET'}] ${url}`);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: mergedSignal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // ignore non-json error body
        }

        const message = errorData.message || response.statusText || `HTTP Error ${response.status}`;
        const code = errorData.code || `ERR_${response.status}`;

        this.logger.error(`HTTP Error [${response.status}] ${url}`, errorData);

        throw new HttpError(response.status, response.statusText, code, message, errorData);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new HttpError(408, 'Request Timeout', 'ERR_TIMEOUT', `Request to ${url} timed out after ${timeout}ms`);
      }

      if (err instanceof HttpError) {
        throw err;
      }

      this.logger.error(`Network Failure for ${url}`, err);
      throw new HttpError(0, 'Network Error', 'ERR_NETWORK', err.message || 'Network request failed');
    }
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}
