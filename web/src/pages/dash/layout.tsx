import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { LOGO_TEXT } from '../../constants/branding';
import useAuth, { useLogout } from '../../hooks/use-auth';
import { ROUTES } from '../router';

export default function DashLayout() {
  const { loginInfo, isLoading } = useAuth();
  const navigate = useNavigate();

  // redirect to login page if not logged in
  useEffect(() => {
    if (!isLoading && !loginInfo) navigate(ROUTES.login, { replace: true });
  }, [isLoading, loginInfo, navigate]);

  const logout = useLogout();

  return (
    <div className="min-h-screen bg-blue-50">
      <main className="grid mx-auto px-4 container xl:grid-cols-[20rem_1fr]">
        <nav className="sticky top-0 self-start pb-4 pt-6">
          <h1>
            <Link
              className="select-none text-3xl text-blue-500 font-bold font-display"
              to={ROUTES.home}
            >
              {LOGO_TEXT}
            </Link>
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-sm">
              <div className="i-tabler-user" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm text-neutral-700">
                {loginInfo ? loginInfo.email : '...'}
              </p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  toast.success('Logged out!');
                  navigate(ROUTES.home, { replace: true });
                }}
                className="text-xs text-neutral-500"
              >
                Logout
              </button>
            </div>
          </div>
          <ul className="mt-4 flex flex-col select-none">
            {[
              { icon: 'i-tabler-arrow-back-up', text: 'Home', to: ROUTES.home },
              {
                icon: 'i-tabler-rocket',
                text: 'Deploy a new H100',
                to: ROUTES.deploy,
              },
              {
                icon: 'i-tabler-server',
                text: 'Virtual machines',
                to: ROUTES.list,
              },
              { icon: 'i-tabler-user', text: 'Account', to: ROUTES.account },
            ].map(({ icon, text, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `font-display text-sm inline-flex items-center gap-2 py-1.5 transition-colors ${isActive ? 'text-gray-900 drop-shadow-sm' : 'text-gray-500'}`
                  }
                >
                  <div className={`${icon}`} />
                  {text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="z-0 mb-24 mt-6 flex flex-col gap-y-4 rounded-xl bg-blue-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
