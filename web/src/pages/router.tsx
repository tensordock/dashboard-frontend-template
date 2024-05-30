import { createBrowserRouter } from 'react-router-dom';

import HomePage from './home';
import DashLayout from './dash/layout';
import AuthLayout from './auth/layout';
import LoginPage from './auth/login';
import DeployPage from './dash/deploy';
import AccountPage from './dash/account';
import ListPage from './dash/list';
import SignupPage from './auth/signup';

const router = createBrowserRouter([
  // { path: '/', element: <HomePage /> },
  { path: '/', element: <HomePage /> },
  {
    element: <DashLayout />,
    children: [
      { path: 'deploy', element: <DeployPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'list', element: <ListPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
]);

export default router;
