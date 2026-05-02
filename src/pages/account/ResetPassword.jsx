import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Form, FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import SubmitButton from '@/common/components/form/SubmitButton';
import { RedSpan } from '@/common/components/form/styles';
import { auth } from '@/firebase-config';
import { confirmPasswordReset } from 'firebase/auth';
import styled from 'styled-components';

const PasswordStrength = styled.div`
  height: 5px;
  border-radius: 3px;
  background-color: ${({ $strength }) => {
    switch ($strength) {
      case 'weak':
        return '#ff4d4d';
      case 'medium':
        return '#ffd700';
      case 'strong':
        return '#32cd32';
      default:
        return '#ccc';
    }
  }};
  width: ${({ $strength }) => {
    switch ($strength) {
      case 'weak':
        return '33%';
      case 'medium':
        return '66%';
      case 'strong':
        return '100%';
      default:
        return '0%';
    }
  }};
  transition: all 0.3s ease;
`;

const PasswordRequirements = styled.ul`
  font-size: 0.8rem;
  color: #666;
  margin: 0;
  padding-left: 20px;
  text-align: left;
`;

const checkPasswordStrength = (password) => {
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[a-z]/.test(password) ? 1 : 0) +
    (/\d/.test(password) ? 1 : 0) +
    (/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0);

  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
};

const getUnmetRequirements = (password) => {
  const requirements = [];
  if (password.length < 8) requirements.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) requirements.push('One uppercase letter');
  if (!/[a-z]/.test(password)) requirements.push('One lowercase letter');
  if (!/\d/.test(password)) requirements.push('One number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    requirements.push('One special character');
  return requirements;
};

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oobCode, setOobCode] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Firebase password reset links use query params: ?mode=resetPassword&oobCode=xxx
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const code = params.get('oobCode');

    if (!code) {
      setError(
        'No reset token found. Please request a new password reset link.'
      );
    } else if (mode !== 'resetPassword') {
      setError('Invalid reset link. Please request a new password reset link.');
    } else {
      setOobCode(code);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!oobCode) {
      setError(
        'Reset token not found. Please request a new password reset link.'
      );
      return;
    }

    const unmet = getUnmetRequirements(password);
    if (unmet.length > 0) {
      setError(unmet.join(', '));
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      navigate('/login', {
        state: {
          message:
            'Password reset successfully. Please log in with your new password.',
        },
        replace: true,
      });
    } catch (err) {
      if (err.code === 'auth/expired-action-code') {
        setError('Reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError(
          'Reset link is invalid or already used. Please request a new one.'
        );
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const unmet = getUnmetRequirements(password);

  return (
    <Form onSubmit={handleSubmit}>
      <FormTitle>Set New Password</FormTitle>
      {error && <RedSpan>{error}</RedSpan>}
      <Input.Password
        title='New Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {password && (
        <>
          <PasswordStrength $strength={checkPasswordStrength(password)} />
          {unmet.length > 0 && (
            <PasswordRequirements>
              {unmet.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </PasswordRequirements>
          )}
        </>
      )}
      <Input.Password
        title='Confirm Password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <SubmitButton onClick={() => {}} disabled={isLoading || !oobCode}>
        {isLoading ? 'Updating...' : 'Update Password'}
      </SubmitButton>
    </Form>
  );
}
