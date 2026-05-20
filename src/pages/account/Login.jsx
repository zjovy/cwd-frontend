import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '@/common/contexts/UserContext';
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
  StyledInput,
  PasswordWrapper,
  PasswordInput,
  EyeBtn,
  SubmitBtn,
  ErrorMsg,
} from '@/pages/account/AuthLayout';

function mapAuthCodeToMessage(authCode) {
  switch (authCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
      return 'Email or password is incorrect. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

const FieldFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ForgotLink = styled(Link)`
  font-size: 12px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: #3b82f6;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f0f0ee;
  }

  span {
    font-size: 12px;
    color: #c4c4c0;
  }
`;

const GoogleBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: #ffffff;
  border: 1.5px solid #e8e8e6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: #374151;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    border-color: #d1d5db;
    background: #fafaf9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SignUpBtn = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 11px;
  background: transparent;
  border: 1.5px solid #1a1a1a;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background: #1a1a1a;
    color: #ffffff;
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const { login, googleAuth } = useUser();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formState.email, formState.password);
      navigate('/', { replace: true });
    } catch (error) {
      setError(mapAuthCodeToMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleAuth();
    } catch (error) {
      setError(mapAuthCodeToMessage(error.code));
    }
  };

  return (
    <>
      <FontImport />
      <PageWrapper>
        <LeftPanel>
          <PanelRing />
          <HeroText>
            <PanelAccentBar />
            <HeroTitle>C&amp;W Market Donation Dashboard</HeroTitle>
            <HeroSubtitle>Sign in to view donation information</HeroSubtitle>
          </HeroText>
        </LeftPanel>

        <RightPanel>
          <FormCard>
            <FormHeader>
              <FormTitle>Welcome back</FormTitle>
              <FormSubtitle>Sign in to your account to continue</FormSubtitle>
            </FormHeader>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <Label htmlFor='email'>Email</Label>
                  <StyledInput
                    id='email'
                    type='email'
                    name='email'
                    placeholder='craigjones@example.com'
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field>
                  <Label htmlFor='password'>Password</Label>
                  <PasswordWrapper>
                    <PasswordInput
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      placeholder='••••••••'
                      value={formState.password}
                      onChange={handleChange}
                      required
                    />
                    <EyeBtn
                      type='button'
                      onClick={() => setShowPassword((p) => !p)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </EyeBtn>
                  </PasswordWrapper>
                  <FieldFooter>
                    <ForgotLink to='/forgot-password'>
                      Forgot password?
                    </ForgotLink>
                  </FieldFooter>
                </Field>
              </FieldGroup>

              <SubmitBtn type='submit' disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </SubmitBtn>
            </form>

            <Divider>
              <span>or</span>
            </Divider>

            <GoogleBtn
              type='button'
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg width='16' height='16' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              Continue with Google
            </GoogleBtn>

            <SignUpBtn type='button' onClick={() => navigate('/signup')}>
              Create an account
            </SignUpBtn>
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </>
  );
}