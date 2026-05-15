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

  async getById(id, signal) {
    const raw = await request(buildUrl(ENDPOINTS.DONATION_BY_ID(id)), {
      signal,
    });
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

  async getAllForRange({ startDate, endDate }, signal) {
    const LIMIT = 1000;
    let page = 1;
    const all = [];
    while (true) {
      const { donations, total } = await this.getAll(
        { startDate, endDate, limit: LIMIT, page },
        signal
      );
      all.push(...donations);
      if (all.length >= total || donations.length === 0) break;
      page++;
    }
    return all;
  },
};

export default donationService;
