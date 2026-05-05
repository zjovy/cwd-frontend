import { buildUrl, request } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';

const adminService = {
  getUsers() {
    return request(buildUrl(ENDPOINTS.AUTH_USERS));
  },

  setRole(uid, role) {
    return request(buildUrl(ENDPOINTS.AUTH_SET_ROLE(uid)), {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  signup(data) {
    return request(buildUrl(ENDPOINTS.AUTH_SIGNUP), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default adminService;
