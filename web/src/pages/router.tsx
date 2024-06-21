/* eslint-disable react-refresh/only-export-components */

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ChangePasswordPage from './auth/change-password';
import AuthLayout from './auth/layout';
import LoginPage from './auth/login';
import ResetPasswordPage from './auth/reset-password';
import ConfirmAccountPage from './confirm';
import AccountPage from './dash/account';
import AutomationsPage from './dash/automations';
import AddAutomationPage from './dash/automations-add';
import DashLayout from './dash/layout';
import LayoutRequireLogin from './dash/layout-require-login';
import VirtualMachinesPage from './dash/virtual-machines';
import NotFoundPage from './notfound';

const SignupPage = React.lazy(() => import('./auth/signup'));
const DepositFundsPage = React.lazy(() => import('./dash/account-deposit'));
const DeployPage = React.lazy(() => import('./dash/deploy'));
const HomePage = React.lazy(() => import('./home'));

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
