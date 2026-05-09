import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '@/firebase-config';
import { confirmPasswordReset } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import styled, { createGlobalStyle } from 'styled-components';

const FontImport = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
  .login-font { font-family: 'Sora', -apple-system, sans-serif; }
`;

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family:
    'Sora',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  width: 42%;
  background:
    radial-gradient(
      ellipse at 80% 10%,
      rgba(59, 130, 246, 0.22) 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse at 10% 90%,
      rgba(59, 130, 246, 0.14) 0%,
      transparent 50%
    ),
    #111111;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 44px 48px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.055) 1px,
      transparent 1px
    );
    background-size: 28px 28px;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -200px;
    right: -200px;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    border: 1.5px solid rgba(59, 130, 246, 0.18);
    pointer-events: none;
  }

  @media (max-width: 900px) {
    width: 36%;
    padding: 36px 32px;
  }

  @media (max-width: 640px) {
    width: 100%;
    flex-shrink: 0;
    height: auto;
    padding: 28px 24px;
    justify-content: flex-start;
  }
`;

const PanelRing = styled.div`
  position: absolute;
  top: -80px;
  left: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.07);
  pointer-events: none;
`;

const PanelAccentBar = styled.div`
  width: 36px;
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    margin-bottom: 12px;
  }
`;

const HeroText = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: clamp(24px, 3.5vw, 48px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.035em;
  margin: 0 0 16px;

  @media (max-width: 640px) {
    font-size: 22px;
    margin: 0 0 8px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(14px, 1.2vw, 18px);
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  background: #f5f5f4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 24px 16px;
    align-items: flex-start;
  }
`;

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e8e8e6;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  @media (max-width: 640px) {
    padding: 28px 24px;
    border-radius: 12px;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 28px;
`;

const FormTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.03em;
  margin: 0 0 5px;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  border: 1.5px solid #e8e8e6;
  border-radius: 8px;
  background: #fafaf9;
  color: #1a1a1a;
  box-sizing: border-box;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    background 0.15s;
  outline: none;

  &::placeholder {
    color: #c4c4c0;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordInput = styled(StyledInput)`
  padding-right: 44px;
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.15s;

  &:hover {
    color: #6b7280;
  }
`;

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

const SubmitBtn = styled.button`
  width: 100%;
  padding: 11px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;
  letter-spacing: -0.01em;

  &:hover:not(:disabled) {
    background: #2d2d2d;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  color: #1f2937;
  padding: 14px;
  border-radius: 8px;
  background-color: #fef2f2;
  border: 1.5px solid #fecaca;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
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
