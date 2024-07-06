import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants/pages';
import useAuth from '../../hooks/use-auth';

export default function LayoutRequireLogin() {
  const navigate = useNavigate();
  const { loginInfo, isLoading } = useAuth();

  // redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !loginInfo?.loggedIn)
      navigate(ROUTES.login, { replace: true });
  }, [isLoading, loginInfo, navigate]);

  return <Outlet />;
}
