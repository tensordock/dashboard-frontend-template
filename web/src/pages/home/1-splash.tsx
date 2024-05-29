import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

import { ROUTES } from '../router';

import BGImage from '../../assets/img/bg.jpg';
import DeployImage from '../../assets/img/deploy.png';
import { DOCUMENTATION_URL, INFRASTRUCTURE_URL } from '../../constants/routes';

const navLinks = [
  { text: 'Deploy', to: '/deploy' },
  { text: 'Infrastructure', to: INFRASTRUCTURE_URL },
  { text: 'Documentation', to: DOCUMENTATION_URL },
];

export default function SplashSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null!);
  const nextSectionRef = useRef<HTMLDivElement>(null!);

  const [scrolledBelowSplash, setScrolledBelowSplash] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (
        navbarRef.current.clientHeight >
        nextSectionRef.current.getBoundingClientRect().top
      ) {
        // we are below
        if (!scrolledBelowSplash) setScrolledBelowSplash(true);
      } else {
        // we are above
        if (scrolledBelowSplash) setScrolledBelowSplash(false);
      }
    };
    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <>
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BGImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-black/25" />
        <nav
          className={`fixed top-0 z-1 w-full transition-all duration-300 ${scrolledBelowSplash ? 'bg-[#061A27] shadow-lg backdrop-blur' : 'bg-[#061A27]/0'} ${menuOpen && !scrolledBelowSplash ? 'lg:bg-[#061A27]/0 max-lg:bg-[#061A27]' : ''}`}
          ref={navbarRef}
        >
          <div className="mx-auto flex items-center px-4 py-3 container">
            <h1 className="select-none text-3xl text-white font-extrabold font-display">
              H100cloud
            </h1>
            <ul className="ml-8 hidden font-medium font-display lg:flex">
              {/* Desktop navbar */}
              {navLinks.map(({ text, to }) => (
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
            <div className="ml-auto hidden font-medium font-display lg:flex">
              <Link
                to={ROUTES.login}
                className="inline-block px-2 py-1 text-sm text-white/60 font-display transition-colors hover:text-white/100"
              >
                Login
              </Link>
              <Link
                to={ROUTES.signup}
                className="inline-block px-2 py-1 text-sm text-white/60 font-display transition-colors hover:text-white/100"
              >
                Register
              </Link>
            </div>
            <button
              className="ml-auto inline-block text-4xl text-white/75 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <div className="i-tabler-menu-2" />
            </button>
          </div>
          <AnimatePresence>
            {/* Mobile navbar */}
            {menuOpen && (
              <motion.div
                className="mx-auto overflow-hidden px-4 container lg:hidden"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
              >
                <ul className="flex flex-col items-end pb-4 text-lg text-white/80 font-display">
                  {[
                    ...navLinks,
                    { text: 'Login', to: ROUTES.login },
                    { text: 'Register', to: ROUTES.signup },
                  ].map(({ text, to }) => (
                    <li key={to}>
                      <Link to={to} className="inline-block py-2">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
        {/* Splash */}
        <div className="relative grid mx-auto items-center gap-x-16 gap-y-12 overflow-hidden pt-28 container xl:grid-cols-2 xl:h-screen xl:max-h-2xl xl:min-h-140">
          <div className="flex flex-col px-2 text-center xl:text-left">
            <h2 className="select-none text-3xl text-white font-light font-display lg:text-4xl xl:text-5xl">
              <div>
                The H100 cloud &mdash;{' '}
                <strong className="mt-2 inline-block font-bold">
                  $2.50/hr
                </strong>
                .
              </div>
              <div className="mt-1">
                On demand{` `}
                <ReactTyped
                  className="typed-text fw-bold"
                  strings={['AI', 'HPC', 'image gen', 'ML', 'acceleration']}
                  typeSpeed={50}
                  loop={true}
                  backDelay={1500}
                />
                .
              </div>
            </h2>
            <p className="mt-4 text-xl text-white/75 font-300">
              H100cloud gives you access to the industry's most powerful GPUs
              for your most demanding HPC workloads
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-x-1 gap-y-6 md:flex-row xl:justify-start">
              <Link
                to="/deploy"
                className="inline-block select-none rounded bg-white px-6 py-2.5 text-neutral-6 font-medium font-display"
              >
                Deploy a GPU Server
              </Link>
              <a
                target="_blank"
                href="https://h100cloud.com"
                className="inline-block select-none border-2 border-white rounded px-6 py-2.5 text-white font-medium font-display"
              >
                Custom Servers
              </a>
            </div>
          </div>
          <Link
            to="/deploy"
            className="mx-auto block h-12 px-2 container lg:h-30 md:h-24 sm:h-16 xl:h-auto xl:max-w-xl"
          >
            <img
              src={DeployImage}
              alt="Deploy"
              className="w-full rounded-t transition-transform xl:rounded-b xl:hover:translate-0 hover:-translate-y-5 xl:hover:scale-102"
            />
          </Link>
        </div>
      </section>
      <div ref={nextSectionRef} />
    </>
  );
}
