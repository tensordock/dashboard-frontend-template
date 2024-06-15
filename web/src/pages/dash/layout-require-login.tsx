import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/use-auth';
import { useEffect } from 'react';
import * as constants from '../../constants';

export default function LayoutRequireLogin() {
  const navigate = useNavigate();
  const { loginInfo, isLoading } = useAuth();

  // redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !loginInfo?.loggedIn)
      navigate(constants.ROUTES.login, { replace: true });
  }, [isLoading, loginInfo, navigate]);

  return <Outlet />;
}
