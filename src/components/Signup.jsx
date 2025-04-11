import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Signup = ({ setToken }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/machine-search';

  return <AuthForm setToken={setToken} initialMode="signup" redirectTo={redirectTo} />;
};

export default Signup;