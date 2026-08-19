export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, error?: unknown, ...args: unknown[]): void;
}

const SENSITIVE_KEYS = ['token', 'password', 'secret', 'authorization', 'jwt', 'apiKey', 'access_token', 'refresh_token'];

function redactSensitive(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(redactSensitive);
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitive(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

export class AppLogger implements ILogger {
  constructor(private context: string, private isDev: boolean = false) {}

  debug(message: string, ...args: unknown[]): void {
    if (this.isDev) {
      console.debug(`[DEBUG][${this.context}] ${message}`, ...args.map(redactSensitive));
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[INFO][${this.context}] ${message}`, ...args.map(redactSensitive));
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN][${this.context}] ${message}`, ...args.map(redactSensitive));
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    console.error(`[ERROR][${this.context}] ${message}`, error, ...args.map(redactSensitive));
  }
}

export function createLogger(context: string, isDev = false): ILogger {
  return new AppLogger(context, isDev);
}
