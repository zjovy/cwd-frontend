import { buildUrl, request } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  buildDonorRequestBody,
  transformDonor,
  transformDonorList,
} from '@/api/transformers';

const donorService = {
  async getAll(params = {}, signal) {
    const { signal: _ignored, ...rest } = params;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v != null && v !== '')
      )
    ).toString();
    const raw = await request(
      buildUrl(`${ENDPOINTS.DONORS}${query ? `?${query}` : ''}`),
      { signal }
    );
    return transformDonorList(raw);
  },

  async getById(id, signal) {
    const raw = await request(buildUrl(ENDPOINTS.DONOR_BY_ID(id)), { signal });
    return transformDonor(raw);
  },

  create(data) {
    return request(buildUrl(ENDPOINTS.DONORS), {
      method: 'POST',
      body: JSON.stringify(buildDonorRequestBody(data)),
    });
  },

  update(id, data) {
    return request(buildUrl(ENDPOINTS.DONOR_BY_ID(id)), {
      method: 'PUT',
      body: JSON.stringify(buildDonorRequestBody(data)),
    });
  },

  delete(id) {
    return request(buildUrl(ENDPOINTS.DONOR_BY_ID(id)), {
      method: 'DELETE',
    });
  },

  upsertByEmail(data) {
    return request(buildUrl(ENDPOINTS.DONOR_UPSERT), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export default donorService;
