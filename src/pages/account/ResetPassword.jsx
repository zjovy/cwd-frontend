import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '@/firebase-config';
import { confirmPasswordReset } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import {
  FontImport,
  PageWrapper,
  LeftPanel,
  PanelRing,
  PanelAccentBar,
  HeroText,
  HeroTitle,
  HeroSubtitle,
  RightPanel,
  FormCard,
  FormHeader,
  FormTitle,
  FormSubtitle,
  FieldGroup,
  Field,
  Label,
  PasswordWrapper,
  PasswordInput,
  EyeBtn,
  SubmitBtn,
  ErrorMsg,
} from '@/pages/account/AuthLayout';

const PasswordStrength = styled.div`
  height: 4px;
  border-radius: 2px;
  background-color: ${({ $strength }) => {
    switch ($strength) {
      case 'weak':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'strong':
        return '#10b981';
      default:
        return '#e5e7eb';
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
  margin-top: 6px;
  transition: all 0.3s ease;
`;

const RequirementsList = styled.ul`
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0 0;
  padding-left: 18px;
  list-style: none;

  li {
    position: relative;
    padding-left: 20px;
    line-height: 1.5;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${({ $allMet }) => ($allMet ? '#10b981' : '#d1d5db')};
      font-weight: bold;
    }

    &.unmet::before {
      content: '○';
      color: #d1d5db;
    }
  }
`;

const SuccessMsg = styled.div`
  color: #1f2937;
  padding: 14px;
  border-radius: 8px;
  background-color: #ecfdf5;
  border: 1.5px solid #d1fae5;
  font-size: 14px;
  line-height: 1.5;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const strength = checkPasswordStrength(password);

  return (
    <>
      <FontImport />
      <PageWrapper>
        <LeftPanel>
          <PanelRing />
          <HeroText>
            <PanelAccentBar />
            <HeroTitle>C&amp;W Market Donation Dashboard</HeroTitle>
            <HeroSubtitle>Create a new password for your account</HeroSubtitle>
          </HeroText>
        </LeftPanel>

        <RightPanel>
          <FormCard>
            <FormHeader>
              <FormTitle>Set new password</FormTitle>
              <FormSubtitle>
                Choose a strong password to secure your account
              </FormSubtitle>
            </FormHeader>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            {!error || oobCode ? (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <Label htmlFor='password'>New Password</Label>
                    <PasswordWrapper>
                      <PasswordInput
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <EyeBtn
                        type='button'
                        onClick={() => setShowPassword((p) => !p)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </EyeBtn>
                    </PasswordWrapper>
                    {password && (
                      <>
                        <PasswordStrength $strength={strength} />
                        {unmet.length > 0 && (
                          <RequirementsList $allMet={unmet.length === 0}>
                            <li className={unmet.includes('At least 8 characters') ? 'unmet' : ''}>
                              At least 8 characters
                            </li>
                            <li className={unmet.includes('One uppercase letter') ? 'unmet' : ''}>
                              One uppercase letter
                            </li>
                            <li className={unmet.includes('One lowercase letter') ? 'unmet' : ''}>
                              One lowercase letter
                            </li>
                            <li className={unmet.includes('One number') ? 'unmet' : ''}>
                              One number
                            </li>
                            <li className={unmet.includes('One special character') ? 'unmet' : ''}>
                              One special character (!@#$%^&*)
                            </li>
                          </RequirementsList>
                        )}
                      </>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor='confirmPassword'>Confirm Password</Label>
                    <PasswordWrapper>
                      <PasswordInput
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <EyeBtn
                        type='button'
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </EyeBtn>
                    </PasswordWrapper>
                  </Field>
                </FieldGroup>

                <SubmitBtn type='submit' disabled={isLoading || !oobCode}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </SubmitBtn>
              </form>
            ) : (
              <SuccessMsg>Password reset successfully!</SuccessMsg>
            )}
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </>
  );
}
