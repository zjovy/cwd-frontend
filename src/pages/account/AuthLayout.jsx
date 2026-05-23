import { Link } from 'react-router-dom';

import styled, { createGlobalStyle } from 'styled-components';

export const FontImport = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
`;

export const PageWrapper = styled.div`
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

export const LeftPanel = styled.div`
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

export const PanelRing = styled.div`
  position: absolute;
  top: -80px;
  left: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.07);
  pointer-events: none;
`;

export const PanelAccentBar = styled.div`
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

export const HeroText = styled.div`
  position: relative;
  z-index: 1;
`;

export const HeroTitle = styled.h1`
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

export const HeroSubtitle = styled.p`
  font-size: clamp(14px, 1.2vw, 18px);
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

export const RightPanel = styled.div`
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

export const FormCard = styled.div`
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

export const FormHeader = styled.div`
  margin-bottom: 28px;
`;

export const FormTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.03em;
  margin: 0 0 5px;
`;

export const FormSubtitle = styled.p`
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

export const StyledInput = styled.input`
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

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const PasswordInput = styled(StyledInput)`
  padding-right: 44px;
`;

export const EyeBtn = styled.button`
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

export const SubmitBtn = styled.button`
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

export const ErrorMsg = styled.div`
  color: #1f2937;
  padding: 14px;
  border-radius: 8px;
  background-color: #fef2f2;
  border: 1.5px solid #fecaca;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

export const Divider = styled.div`
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

export const GoogleBtn = styled.button`
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

export const SuccessMsg = styled.div`
  color: #1f2937;
  padding: 14px;
  border-radius: 8px;
  background-color: #ecfdf5;
  border: 1.5px solid #d1fae5;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

export const AuthNavLink = styled(Link)`
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

export function mapAuthCodeToMessage(code) {
  switch (code) {
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

export function mapResetErrorCodeToMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with that email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait before trying again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}
