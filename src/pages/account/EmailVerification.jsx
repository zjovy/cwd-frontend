import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Subtitle, Title } from '@/common/components/atoms/Text';
import styled from 'styled-components';

const VerificationPage = styled.div`
  flex: 1 0 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 100px;
`;

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error');
  const success = searchParams.get('success');

  const status = success ? 'success' : error ? 'error' : 'checking';

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <VerificationPage>
      {status === 'checking' && <Title>Checking verification status...</Title>}
      {status === 'success' && (
        <>
          <Title>Email Verified!</Title>
          <Subtitle>{"You'll be redirected to login in 3 seconds..."}</Subtitle>
        </>
      )}
      {status === 'error' && (
        <>
          <Title>Verification Failed</Title>
          <Subtitle>Please try signing up again or contact support.</Subtitle>
        </>
      )}
    </VerificationPage>
  );
}
