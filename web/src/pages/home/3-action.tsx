import { Link } from 'react-router-dom';

import { BG_IMAGE_URL } from '../../constants/branding';
import { CUSTOM_REQUESTS_URL } from '../../constants/external';
import { ROUTES } from '../../constants/pages';

export default function ActionSection() {
  return (
    <section
      className="relative bg-cover"
      style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative mx-auto flex flex-col items-center gap-8 py-18 container lg:py-32 md:py-24">
        <h2 className="text-center text-3xl text-white lh-relaxed font-display">
          Deploy a cloud GPU today from just{' '}
          <strong className="inline-block md:block">$0.50/hour.</strong>
        </h2>
        <div className="flex items-center gap-1">
          <Link
            to={ROUTES.deployForm}
            className="inline-block select-none rounded-btn bg-white px-6 py-2 text-gray-6 font-medium font-display transition-colors hover:bg-gray-6 hover:text-white"
          >
            Get Started
          </Link>
          <a
            target="_blank"
            href={CUSTOM_REQUESTS_URL}
            className="inline-block select-none rounded-btn px-6 py-2 text-white font-medium font-display ring-2 ring-white ring-inset transition-colors hover:bg-white hover:text-gray-6"
          >
            Custom Requests
          </a>
        </div>
      </div>
    </section>
  );
}
