import React, { useEffect, useState } from 'react';

import { buildUrl } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { auth, googleProvider } from '@/firebase-config';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import PropTypes from 'prop-types';

export const UserContext = React.createContext({
  user: null,
  isLoading: false,
  logout: () => {},
  login: () => {},
  googleAuth: () => {},
  requestPasswordReset: () => {},
});

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();

          // Refresh the backend session cookie on every auth state restore,
          // not just on fresh logins, so credentials: 'include' calls work.
          const tokenRes = await fetch(buildUrl(ENDPOINTS.AUTH_TOKEN), {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          if (!tokenRes.ok) {
            console.warn(
              '[UserContext] /auth/token failed — session cookie not set'
            );
          }

          const response = await fetch(buildUrl(ENDPOINTS.AUTH_ME), {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          if (response.ok) {
            const backendUserData = await response.json();
            setUser({ ...firebaseUser, ...backendUserData });
          } else {
            setUser(firebaseUser);
          }
        } catch {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Signs in with Google popup and syncs the user to the MySQL backend.
  const googleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(buildUrl(ENDPOINTS.AUTH_TOKEN), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error('Failed to sync account with server');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    googleAuth,
    requestPasswordReset,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
