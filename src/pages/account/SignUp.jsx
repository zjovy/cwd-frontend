import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';

import { auth } from '@/firebase-config';
import { useUser } from '@/common/contexts/UserContext';
import adminService from '@/services/adminService';
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

const SignInLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: #3b82f6;
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

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { googleAuth } = useUser();

  const [formState, setFormState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGoogleSignup = async () => {
    try {
      await googleAuth();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await adminService.signup({
        email: formState.email,
        password: formState.password,
        firstname: formState.firstname || undefined,
        lastname: formState.lastname || undefined,
      });

      if (response?.customToken) {
        await signInWithCustomToken(auth, response.customToken);
        navigate('/');
      } else {
        navigate('/login', {
          state: {
            message:
              'Account created successfully! Please check your email to verify your account.',
          },
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
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
            <HeroSubtitle>Join our community and start making an impact</HeroSubtitle>
          </HeroText>
        </LeftPanel>

        <RightPanel>
          <FormCard>
            <FormHeader>
              <FormTitle>Create an account</FormTitle>
              <FormSubtitle>Get started with your free account</FormSubtitle>
            </FormHeader>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <Label htmlFor='firstname'>First name</Label>
                  <StyledInput
                    id='firstname'
                    type='text'
                    name='firstname'
                    placeholder='John'
                    value={formState.firstname}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <Label htmlFor='lastname'>Last name</Label>
                  <StyledInput
                    id='lastname'
                    type='text'
                    name='lastname'
                    placeholder='Smith'
                    value={formState.lastname}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <Label htmlFor='email'>Email</Label>
                  <StyledInput
                    id='email'
                    type='email'
                    name='email'
                    placeholder='j@example.com'
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
                      {showPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </EyeBtn>
                  </PasswordWrapper>
                </Field>
              </FieldGroup>

              <SubmitBtn type='submit' disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </SubmitBtn>
            </form>

            <Divider>
              <span>or</span>
            </Divider>

            <GoogleBtn
              type='button'
              onClick={handleGoogleSignup}
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

            <SignInLink to='/login'>Already have an account? Sign in</SignInLink>
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </>
  );
}
