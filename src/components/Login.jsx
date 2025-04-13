import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login = ({ setToken }) => {
  const [searchParams] = useSearchParams();

  // Sanitize redirectTo to prevent open redirect vulnerability
  const rawRedirect = searchParams.get('redirectTo');
  const redirectTo = rawRedirect && rawRedirect.startsWith('/')
    ? rawRedirect
    : '/machine-search';

  return <AuthForm setToken={setToken} initialMode="login" redirectTo={redirectTo} />;
};

export default Login;