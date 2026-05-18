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
});
