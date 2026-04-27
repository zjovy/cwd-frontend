import { useCallback, useEffect, useState } from 'react';

import adminService from '@/services/adminService';

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setRole = useCallback(async (uid, role) => {
    setActionError(null);
    try {
      const response = await adminService.setRole(uid, role);
      setUsers((prev) =>
        prev.map((u) => (u.firebaseUid === uid ? response.user : u)),
      );
    } catch (err) {
      setActionError(err.message);
    }
  }, []);

  return { users, loading, error, actionError, setRole, refetch: fetchUsers };
}
