import { describe, expect, it, vi } from 'vitest';

import * as client from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import dashboardService from '@/services/dashboardService';

vi.mock('@/api/client', () => ({
  buildUrl: (endpoint) => `http://localhost:5050${endpoint}`,
  request: vi.fn(),
}));

describe('dashboardService.syncStripe', () => {
  it('calls POST /sync/stripe/trigger', async () => {
    client.request.mockResolvedValue({ inserted: 2, skipped: 0, errors: [] });

    const result = await dashboardService.syncStripe();

    expect(client.request).toHaveBeenCalledWith(
      `http://localhost:5050${ENDPOINTS.SYNC_STRIPE}`,
      { method: 'POST' }
    );
    expect(result).toEqual({ inserted: 2, skipped: 0, errors: [] });
  });

  it('passes signal to request when provided', async () => {
    client.request.mockResolvedValue({ inserted: 0, skipped: 0, errors: [] });
    const controller = new AbortController();

    await dashboardService.syncStripe(controller.signal);

    expect(client.request).toHaveBeenCalledWith(
      `http://localhost:5050${ENDPOINTS.SYNC_STRIPE}`,
      { method: 'POST', signal: controller.signal }
    );
  });

  it('rejects when request throws', async () => {
    client.request.mockRejectedValue(new Error('network error'));

    await expect(dashboardService.syncStripe()).rejects.toThrow('network error');
  });
});
