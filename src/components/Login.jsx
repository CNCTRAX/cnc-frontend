import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login = ({ setToken }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/machine-search';

  return <AuthForm setToken={setToken} initialMode="login" redirectTo={redirectTo} />;
};

export default Login;