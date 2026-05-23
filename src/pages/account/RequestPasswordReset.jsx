import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useUser } from '@/common/contexts/UserContext';
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
  SubmitBtn,
  ErrorMsg,
  mapResetErrorCodeToMessage,
} from '@/pages/account/AuthLayout';

const BackLink = styled(Link)`
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

const SuccessMessage = styled.div`
  color: #1f2937;
  padding: 14px;
  border-radius: 8px;
  background-color: #ecfdf5;
  border: 1.5px solid #d1fae5;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

export default function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { requestPasswordReset } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(mapResetErrorCodeToMessage(err.code));
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
            <HeroSubtitle>Reset your password to regain access</HeroSubtitle>
          </HeroText>
        </LeftPanel>

        <RightPanel>
          <FormCard>
            <FormHeader>
              <FormTitle>Forgot password?</FormTitle>
              <FormSubtitle>
                Enter your email to receive reset instructions
              </FormSubtitle>
            </FormHeader>

            {!success ? (
              <>
                {error && <ErrorMsg>{error}</ErrorMsg>}

                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <Label htmlFor='email'>Email</Label>
                      <StyledInput
                        id='email'
                        type='email'
                        placeholder='j@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Field>
                  </FieldGroup>

                  <SubmitBtn type='submit' disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Email'}
                  </SubmitBtn>
                </form>

                <BackLink to='/login'>Back to Login</BackLink>
              </>
            ) : (
              <>
                <SuccessMessage>
                  ✓ Password reset instructions have been sent to your email.
                  Please check your inbox and follow the link. If you
                  don&apos;t see it within a few minutes, check your spam
                  folder.
                </SuccessMessage>

                <BackLink to='/login'>Back to Login</BackLink>
              </>
            )}
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </>
  );
}
