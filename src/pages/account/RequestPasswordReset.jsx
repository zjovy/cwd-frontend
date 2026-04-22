import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form, FormTitle } from '@/common/components/form/Form';
import { Input } from '@/common/components/form/Input';
import SubmitButton from '@/common/components/form/SubmitButton';
import { RedSpan } from '@/common/components/form/styles';
import { useUser } from '@/common/contexts/UserContext';
import styled from 'styled-components';

const SuccessMessage = styled.div`
  color: #2e7d32;
  padding: 10px;
  border-radius: 4px;
  background-color: #edf7ed;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
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
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormTitle>Reset Password</FormTitle>
      {!success ? (
        <>
          {error && <RedSpan>{error}</RedSpan>}
          <Input.Text
            title='Email'
            placeholder='j@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <SubmitButton onClick={() => {}} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </SubmitButton>
          <StyledLink to='/login'>Back to Login</StyledLink>
        </>
      ) : (
        <>
          <SuccessMessage>
            Password reset instructions have been sent to your email. Please
            check your inbox and follow the instructions. If you don&apos;t see
            it within a few minutes, check your spam folder.
          </SuccessMessage>
          <StyledLink to='/login'>Back to Login</StyledLink>
        </>
      )}
    </Form>
  );
}
