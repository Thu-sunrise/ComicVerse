import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '../client/ApiClient';
import { HttpError } from '../client/HttpError';

describe('ApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should make successful GET request and return JSON', async () => {
    const mockData = { id: 1, title: 'Test Story' };
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    vi.stubGlobal('fetch', fetchSpy);

    const client = new ApiClient({ baseUrl: 'http://localhost:8080' });
    const result = await client.get('/api/v1/stories');

    expect(result).toEqual(mockData);
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/stories',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should throw HttpError on 404 response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Story not found', code: 'ERR_STORY_NOT_FOUND' }),
    } as Response);

    vi.stubGlobal('fetch', fetchSpy);

    const client = new ApiClient({ baseUrl: 'http://localhost:8080' });
    await expect(client.get('/api/v1/stories/999')).rejects.toThrow(HttpError);
  });

  it('should attach Bearer token when getToken is provided', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as Response);

    vi.stubGlobal('fetch', fetchSpy);

    const client = new ApiClient({
      baseUrl: 'http://localhost:8080',
      getToken: () => 'my_jwt_token',
    });

    await client.get('/api/v1/user');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const callArgs = fetchSpy.mock.calls[0];
    expect(callArgs[0]).toBe('http://localhost:8080/api/v1/user');
    const headers: Headers = callArgs[1].headers;
    expect(headers.get('Authorization')).toBe('Bearer my_jwt_token');
  });
});
