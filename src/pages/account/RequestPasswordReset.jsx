import React, { useState } from 'react';

import { useUser } from '@/common/contexts/UserContext';
import {
  AuthNavLink,
  ErrorMsg,
  Field,
  FieldGroup,
  FontImport,
  FormCard,
  FormHeader,
  FormSubtitle,
  FormTitle,
  HeroSubtitle,
  HeroText,
  HeroTitle,
  Label,
  LeftPanel,
  PageWrapper,
  PanelAccentBar,
  PanelRing,
  RightPanel,
  StyledInput,
  SubmitBtn,
  SuccessMsg,
  mapResetErrorCodeToMessage,
} from '@/pages/account/AuthLayout';

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

                <AuthNavLink to='/login'>Back to Login</AuthNavLink>
              </>
            ) : (
              <>
                <SuccessMsg>
                  ✓ Password reset instructions have been sent to your email.
                  Please check your inbox and follow the link. If you don&apos;t
                  see it within a few minutes, check your spam folder.
                </SuccessMsg>

                <AuthNavLink to='/login'>Back to Login</AuthNavLink>
              </>
            )}
          </FormCard>
        </RightPanel>
      </PageWrapper>
    </>
  );
}
