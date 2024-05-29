import { createBrowserRouter } from 'react-router-dom';
// import HomePage from './home';
import HomePageV2 from './home';
import DashLayout from './dash/layout';
import AuthLayout from './auth/layout';

export const ROUTES = {
  home: '/',
  deploy: '/deploy',
  login: '/login',
  signup: '/signup',
  account: '/account',
  list: '/list',
};

const router = createBrowserRouter([
  // { path: '/', element: <HomePage /> },
  { path: '/', element: <HomePageV2 /> },
  {
    element: <DashLayout />,
    children: [
      { path: 'deploy', element: <div>Deploy</div> },
      { path: 'account', element: <div>Deploy</div> },
      { path: 'list', element: <div>List</div> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <div>Login</div> },
      { path: 'signup', element: <div>Signup</div> },
    ],
  },
]);

export default router;
