import { describe, it, expect } from 'vitest';
import { validateAndParseEnv } from '../env/schema';

describe('Config Schema Validation', () => {
  it('should parse valid environment variables', () => {
    const raw = {
      VITE_API_URL: 'https://api.comicverse.com',
      VITE_APP_ENV: 'production',
      VITE_APP_NAME: 'ComicVerse Prod',
      VITE_AUTH_ENABLED: 'true',
    };

    const config = validateAndParseEnv(raw);
    expect(config.apiBaseUrl).toBe('https://api.comicverse.com');
    expect(config.appEnv).toBe('production');
    expect(config.isProduction).toBe(true);
    expect(config.authEnabled).toBe(true);
  });

  it('should throw error on invalid API URL', () => {
    const raw = {
      VITE_API_URL: 'not-a-url',
    };

    expect(() => validateAndParseEnv(raw)).toThrow();
  });
});
