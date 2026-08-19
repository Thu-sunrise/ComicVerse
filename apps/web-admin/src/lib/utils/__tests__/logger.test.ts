import { describe, it, expect, vi } from 'vitest';
import { createLogger } from '../logger/Logger';

describe('Logger Utility', () => {
  it('should redact sensitive keys in logs', () => {
    const logger = createLogger('TestContext', true);
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    logger.info('User login event', { password: 'secret123', token: 'jwt_xyz', email: 'user@test.com' });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedArgs = consoleSpy.mock.calls[0];
    expect(loggedArgs[1]).toEqual({
      password: '[REDACTED]',
      token: '[REDACTED]',
      email: 'user@test.com',
    });

    consoleSpy.mockRestore();
  });
});
