/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter } from 'react-router-dom';
import React from 'react';

import AuthLayout from './auth/layout';
import LoginPage from './auth/login';
const SignupPage = React.lazy(() => import('./auth/signup'));
import AccountPage from './dash/account';
const DepositFundsPage = React.lazy(() => import('./dash/account-deposit'));
import AutomationsPage from './dash/automations';
import AddAutomationPage from './dash/automations-add';
const DeployPage = React.lazy(() => import('./dash/deploy'));
import DashLayout from './dash/layout';
import VirtualMachinesPage from './dash/virtual-machines';
const HomePage = React.lazy(() => import('./home'));
import ConfirmAccountPage from './confirm';
import ResetPasswordPage from './auth/reset-password';
import ChangePasswordPage from './auth/change-password';
import LayoutRequireLogin from './dash/layout-require-login';
import NotFoundPage from './notfound';

const router = createBrowserRouter([
  { path: '*', element: <NotFoundPage /> },
  {
    path: '/',
    element: <HomePage />,
  },
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
