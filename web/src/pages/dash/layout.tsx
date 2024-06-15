import toast from 'react-hot-toast';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { LOGO_TEXT } from '../../constants/branding';
import { ROUTES } from '../../constants/pages';
import useAuth from '../../hooks/use-auth';

export default function DashLayout() {
  const { loginInfo, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-50">
      <main className="grid mx-auto px-4 container xl:grid-cols-[20rem_1fr]">
        <nav className="sticky top-0 self-start pb-4 pt-6">
          <h1>
            <Link
              className="select-none text-3xl text-primary-500 font-bold font-display"
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
              <p className="text-sm text-gray-700">
                {loginInfo?.loggedIn ? loginInfo.email : 'Not logged in'}
              </p>
              {loginInfo?.loggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    toast.success('Logged out!');
                    navigate(ROUTES.home, { replace: true });
                  }}
                  className="text-xs text-gray-500 hover:text-gray-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to={ROUTES.login}
                  className="text-xs text-gray-500 hover:text-gray-600"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
          <ul className="mt-4 flex flex-col select-none">
            {[
              { icon: 'i-tabler-arrow-back-up', text: 'Home', to: ROUTES.home },
              {
                icon: 'i-tabler-rocket',
                text: 'Deploy servers',
                to: ROUTES.deploy,
              },
              {
                icon: 'i-tabler-server',
                text: 'Virtual machines',
                to: ROUTES.list,
              },
              { icon: 'i-tabler-user', text: 'Account', to: ROUTES.account },
              {
                icon: 'i-tabler-automation',
                text: 'Automations',
                to: ROUTES.automations,
              },
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
        <div className="z-0 mb-24 mt-6 flex flex-col gap-y-4 rounded-xl bg-primary-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
