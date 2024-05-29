import { Link } from 'react-router-dom';

import { CUSTOM_REQUESTS_URL } from '../../constants/external';

import BGImage from '../../assets/img/bg.jpg';

export default function ActionSection() {
  return (
    <section
      className="relative bg-cover"
      style={{ backgroundImage: `url(${BGImage})` }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative mx-auto flex flex-col items-center gap-8 py-18 container lg:py-32 md:py-24">
        <h2 className="text-center text-3xl text-white lh-relaxed font-display">
          Deploy a cloud H100 today from just{' '}
          <strong className="inline-block md:block">$2.50/hour.</strong>
        </h2>
        <div className="flex gap-1">
          <Link
            to="/deploy"
            className="inline-block select-none rounded bg-white px-6 py-2.5 text-neutral-6 font-medium font-display transition-colors hover:bg-neutral-6 hover:text-white"
          >
            Get Started
          </Link>
          <a
            target="_blank"
            href={CUSTOM_REQUESTS_URL}
            className="inline-block select-none border-2 border-white rounded px-6 py-2.5 text-white font-medium font-display transition-colors hover:bg-white hover:text-neutral-6"
          >
            Custom Requests
          </a>
        </div>
      </div>
    </section>
  );
}
