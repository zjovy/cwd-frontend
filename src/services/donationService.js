import { buildUrl, request } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  buildDonationCreateBody,
  buildDonationUpdateBody,
  transformDonation,
  transformDonationList,
} from '@/api/transformers';

const donationService = {
  async getAll(params = {}, signal) {
    const { signal: _ignored, ...rest } = params;
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v != null && v !== '')
      )
    ).toString();
    const raw = await request(
      buildUrl(`${ENDPOINTS.DONATIONS}${query ? `?${query}` : ''}`),
      { signal }
    );
    return transformDonationList(raw);
  },

  async getById(id) {
    const raw = await request(buildUrl(ENDPOINTS.DONATION_BY_ID(id)));
    return transformDonation(raw);
  },

  create(data) {
    return request(buildUrl(ENDPOINTS.DONATIONS), {
      method: 'POST',
      body: JSON.stringify(buildDonationCreateBody(data)),
    });
  },

  update(id, data) {
    return request(buildUrl(ENDPOINTS.DONATION_BY_ID(id)), {
      method: 'PUT',
      body: JSON.stringify(buildDonationUpdateBody(data)),
    });
  },

  delete(id) {
    return request(buildUrl(ENDPOINTS.DONATION_BY_ID(id)), {
      method: 'DELETE',
    });
  },

  sendReceipt(id, body) {
    return request(buildUrl(ENDPOINTS.DONATION_RECEIPT(id)), {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
  },
};

export default donationService;
