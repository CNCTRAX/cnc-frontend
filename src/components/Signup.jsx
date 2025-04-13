import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Signup = ({ setToken }) => {
  const [searchParams] = useSearchParams();

  // Prevent open redirect to external domains
  const rawRedirect = searchParams.get('redirectTo');
  const redirectTo = rawRedirect && rawRedirect.startsWith('/')
    ? rawRedirect
    : '/machine-search';

  return <AuthForm setToken={setToken} initialMode="signup" redirectTo={redirectTo} />;
};

export default Signup;