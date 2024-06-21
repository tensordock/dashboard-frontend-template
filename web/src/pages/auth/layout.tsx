import { Suspense, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import Loader from '../../components/loader';
import { INFRASTRUCTURE_URL } from '../../constants';
import {
  BG_IMAGE_URL,
  LOGO_TEXT,
  SHORT_COMPANY_NAME,
} from '../../constants/branding';
import { ROUTES } from '../../constants/pages';
import useAuth from '../../hooks/use-auth';

export default function AuthLayout() {
  const { loginInfo } = useAuth();
  const navigate = useNavigate();

  // redirect to account page if already logged in
  useEffect(() => {
    if (loginInfo?.loggedIn) navigate(ROUTES.account, { replace: true });
  }, [loginInfo, navigate]);

  return (
    <div className="grid mx-auto h-screen max-h-[120rem] max-w-[180rem] overflow-hidden bg-gray-100 lg:grid-cols-2 dark:bg-neutral-800">
      <div
        className="hidden bg-cover bg-center lg:flex lg:items-start lg:justify-center"
        style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
      >
        <nav className="flex items-center">
          <h1>
            <Link
              to={ROUTES.home}
              className="inline-block select-none py-4 text-3xl text-white font-extrabold font-display"
            >
              {LOGO_TEXT}
            </Link>
          </h1>
          <ul className="ml-8 hidden flex font-medium font-display">
            {[
              { text: 'Deploy', to: ROUTES.deployForm },
              { text: 'Infrastructure', to: INFRASTRUCTURE_URL },
            ].map(({ text, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-block px-2 py-1 text-sm text-white/60 font-display transition-colors hover:text-white/100"
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="relative">
        <div className="absolute inset-0 overflow-auto">
          <main className="mx-auto min-h-screen flex flex-col justify-center px-4 py-6 container 2xl:max-w-2xl xl:max-w-xl lg:py-12">
            <div className="overflow-hidden rounded-card bg-white shadow-lg dark:bg-neutral-700 dark:text-white">
              <Link to={ROUTES.home}>
                <h2 className="select-none bg-primary-500 py-4 text-center text-3xl text-white font-bold font-display">
                  {SHORT_COMPANY_NAME}
                </h2>
              </Link>
              <div className="px-8 py-4">
                <Suspense fallback={<Loader />}>
                  <Outlet />
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
