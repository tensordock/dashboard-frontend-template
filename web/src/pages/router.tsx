import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from './auth/layout';
import LoginPage from './auth/login';
import SignupPage from './auth/signup';
import AccountPage from './dash/account';
import DepositFundsPage from './dash/account-deposit';
import AutomationsPage from './dash/automations';
import AddAutomationPage from './dash/automations-add';
import DeployPage from './dash/deploy';
import DashLayout from './dash/layout';
import VirtualMachinesPage from './dash/virtual-machines';
import HomePage from './home';
import ConfirmAccountPage from './confirm';
import ResetPasswordPage from './auth/reset-password';
import ChangePasswordPage from './auth/change-password';
import LayoutRequireLogin from './dash/layout-require-login';

const router = createBrowserRouter([
  // { path: '/', element: <HomePage /> },
  { path: '/', element: <HomePage /> },
  {
    element: <DashLayout />,
    children: [
      { path: 'deploy', element: <DeployPage /> },
      {
        element: <LayoutRequireLogin />,
        children: [
          { path: 'automations', element: <AutomationsPage /> },
          { path: 'automations/add', element: <AddAutomationPage /> },
          { path: 'account', element: <AccountPage /> },
          { path: 'account/deposit', element: <DepositFundsPage /> },
          { path: 'list', element: <VirtualMachinesPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'change-password/:token', element: <ChangePasswordPage /> },
    ],
  },
  { path: 'confirm/:token', element: <ConfirmAccountPage /> },
]);

export default router;
