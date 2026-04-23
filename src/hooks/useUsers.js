import { useCallback, useEffect, useState } from 'react';

import adminService from '@/services/adminService';

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const setApproved = async (uid, isApproved) => {
    try {
      const response = await adminService.setApproved(uid, isApproved);
      setUsers((prev) =>
        prev.map((u) => (u.firebaseUid === uid ? response.user : u)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const setAdmin = async (uid, isAdmin) => {
    try {
      const response = await adminService.setAdmin(uid, isAdmin);
      setUsers((prev) =>
        prev.map((u) => (u.firebaseUid === uid ? response.user : u)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const approveAsAdmin = async (uid) => {
    try {
      await adminService.setApproved(uid, true);
      const response = await adminService.setAdmin(uid, true);
      setUsers((prev) =>
        prev.map((u) => (u.firebaseUid === uid ? response.user : u)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return { users, loading, error, setApproved, setAdmin, approveAsAdmin };
}
