import { Link } from 'react-router-dom';

import { ROUTES } from '../constants/pages';

export default function NotFoundPage() {
  return (
    <main className="h-screen max-h-[600px] min-h-min flex flex-col items-center justify-center">
      <h1 className="text-8xl text-primary-500 font-bold tracking-tight font-display">
        404
      </h1>
      <p className="mt-2 text-gray-500">Page not found</p>
      <Link to={ROUTES.home} className="mt-8 text-gray-500 hover:text-gray-600">
        <span className="i-tabler-arrow-left mr-2 inline-block translate-y-[.125em]" />
        Back
      </Link>
    </main>
  );
}
