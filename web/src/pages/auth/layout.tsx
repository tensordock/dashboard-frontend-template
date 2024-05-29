import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/use-auth';
import { ROUTES } from '../router';

export default function AuthLayout() {
  const { loginInfo } = useAuth();
  const navigate = useNavigate();

  // redirect to account page if already logged in
  useEffect(() => {
    if (loginInfo) navigate(ROUTES.account, { replace: true });
  }, [loginInfo, navigate]);

  return (
    <main className="mx-auto container">
      <h1>Auth Layout</h1>
      <Outlet />
    </main>
  );
}
