import { Link } from 'react-router-dom';

import { COMPANY_NAME, SHORT_COMPANY_NAME } from '../../constants/branding';
import {
  ABOUT_URL,
  COMPANY_HOME_URL,
  CONTACT_EMAIL,
  DOCUMENTATION_URL,
} from '../../constants/external';
import { ROUTES } from '../../constants/pages';

export default function FooterSection() {
  return (
    <footer className="bg-primary-950 pt-18">
      <div className="grid mx-auto mb-12 container md:grid-cols-[1fr_300px]">
        <div>
          <h3 className="px-4 text-xl text-white font-display">
            {COMPANY_NAME}
          </h3>
          <p className="mt-4 max-w-prose px-4 text-white/40">
            {SHORT_COMPANY_NAME} provides startups, AI labs, and enterprises
            access to a massive NVIDIA GPU cloud colocated in the heart of the
            United States managed by Strategic Infrastructure Holdings,
            completely on-demand.
          </p>
        </div>
        <div className="px-4">
          <ul className="grid grid-cols-2 mt-4 text-white/40">
            {[
              { text: 'About', href: ABOUT_URL, external: true },
              { text: 'Deploy', href: ROUTES.deploy },
              { text: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
              {
                text: 'Documentation',
                href: DOCUMENTATION_URL,
                external: true,
              },
            ].map(({ text, href, external }) => (
              <li key={text}>
                <Link
                  to={href}
                  target={external ? '_blank' : undefined}
                  className="inline-block py-1 hover:text-white/80 hover:underline"
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t-[1px] border-white/40 py-8">
        <div className="px-4 text-center text-white/40">
          Copyright © 2024{' '}
          <a
            className="text-white/80 hover:underline"
            href={COMPANY_HOME_URL}
            target="_blank"
          >
            {COMPANY_NAME}
          </a>
          <br />
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}
