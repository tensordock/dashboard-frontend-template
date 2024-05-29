import { Link } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

import BGImage from '../assets/img/bg.jpg';
import CodeAPIImage from '../assets/img/code_api.png';
import DeployImage from '../assets/img/deploy.png';
import DeploymentsImage from '../assets/img/deployments.png';
import MoneyImage from '../assets/img/money.png';

import '@unocss/reset/tailwind.css';

export default function HomePageV2() {
  return (
    <>
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BGImage})` }}
        />
        <div className="absolute inset-0 bg-black/25 z-0" />
        <nav className="fixed w-full top-0 z-1">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <h1 className="text-white font-extrabold text-3xl font-display select-none">
              H100cloud
            </h1>
            <button className="text-4xl inline-block ml-auto text-white/75">
              <div className="i-tabler-menu-2" />
            </button>
          </div>
        </nav>
        {/* Splash */}
        <div className="pt-28 grid xl:grid-cols-2 items-center gap-x-16 gap-y-12 relative xl:h-screen xl:max-h-2xl overflow-hidden container mx-auto">
          <div className="text-center xl:text-left flex flex-col px-2">
            <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-light font-display select-none">
              <div>
                The H100 cloud &mdash;{' '}
                <strong className="font-bold inline-block mt-2">
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
            <p className="text-xl text-white/75 mt-4 font-300">
              H100cloud gives you access to the industry's most powerful GPUs
              for your most demanding HPC workloads
            </p>
            <div className="mt-10 flex flex-col md:flex-row gap-y-6 gap-x-1 items-center justify-center xl:justify-start">
              <Link
                to="/deploy"
                className="rounded bg-white px-6 py-2.5 font-display font-medium text-neutral-6 select-none"
              >
                Deploy a GPU server
              </Link>
              <a
                target="_blank"
                href="https://h100cloud.com"
                className="rounded border-white border-2 px-6 py-2.5 font-display font-medium text-white select-none"
              >
                Custom Servers
              </a>
            </div>
          </div>
          <Link
            to="/deploy"
            className="block h-12 sm:h-16 md:h-24 lg:h-30 xl:h-auto mx-auto px-2 container xl:max-w-xl"
          >
            <img
              src={DeployImage}
              alt="Deploy"
              className="w-full rounded-t xl:rounded-b hover:-translate-y-5 transition-transform xl:hover:translate-0 xl:hover:scale-102"
            />
          </Link>
        </div>
      </section>
      <section className="pt-18 px-4 bg-blue-50">
        <div className="w-full sm:w-120 md:w-160 mx-auto">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-medium font-display text-gray-7">
            Highly performant hardware,{' '}
            <strong className="font-extrabold">secure.</strong>
          </h2>
          <video
            muted
            autoPlay
            loop
            className="my-8"
            src="https://www.strategicinfra.com/assets/h100cloud.webm"
            // @ts-expect-error - video type
            type="video/mp4"
            width="1200"
          ></video>
          <p className="text-gray-500 text-lg max-w-prose">
            Through H100cloud, you get to access cloud resources that previously
            only long-term contract customers could access —{' '}
            <b>available on-demand, pro-rated to the microsecond</b>.
          </p>
        </div>
      </section>
      <section className="py-18 bg-blue-50">
        <ul className="px-4 w-full max-w-lg mx-auto lg:max-w-4xl flex flex-col gap-18">
          {[
            {
              image: DeploymentsImage,
              alt: 'Deployments',
              icon: 'i-tabler-rocket',
              tagline: 'DEPLOY',
              header: (
                <>
                  Unbeatable <strong>Performance</strong>
                </>
              ),
              body: 'Our H100 SXM5 GPUs outperform H100 PCIE cards by 30%, measured by raw FP32 performance',
            },
            {
              image: CodeAPIImage,
              alt: 'API',
              icon: 'i-tabler-code',
              tagline: 'BUILD',
              header: (
                <>
                  REST <strong>API</strong>
                </>
              ),
              body: 'Deploy and manage VMs programatically with our well-documented API. Scale up/down instantly.',
            },
            {
              image: MoneyImage,
              alt: 'Save',
              icon: 'i-tabler-bulb',
              tagline: 'SAVE',
              header: (
                <>
                  H100s, <strong>$2.50/hr</strong>
                </>
              ),
              body: '...a price-to-performance ratio only available on long-term contracts from other suppliers.',
            },
          ].map(({ image, alt, icon, tagline, header, body }, idx) => (
            <li key={tagline} className="grid lg:grid-cols-2 items-center">
              <img
                src={image}
                alt={alt}
                className={`w-full px-12 grayscale ${idx % 2 === 0 ? '' : 'lg:order-last'}`}
              />
              <div className="text-gray-7 mt-4">
                <div className="flex items-center gap-2 text-blue-500 font-medium font-display text-xl">
                  <div className={`${icon} text-2xl`} />
                  {tagline}
                </div>
                <h3 className="font-display text-2xl mt-2">{header}</h3>
                <p className="mt-4 text-gray-500">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="py-16 bg-blue-50/25 text-gray-7 px-4">
        <h2 className="font-display font-400 text-2xl text-center">
          All the bells and whistles
        </h2>
        <p className="text-xl text-center mt-4 text-gray-500 font-300">
          Available right out of the box with H100cloud.
        </p>
        <div className="mt-20 grid gap-20 container mx-auto lg:grid-cols-3">
          {[
            {
              icon: 'i-tabler-brand-ubuntu',
              header: 'Configurable OS',
              body: 'Select from a range of operating systems depending on your needs, from Ubuntu to Windows. Provide custom images to us, and scale your AI inference application.',
            },
            {
              icon: 'i-tabler-lock',
              header: 'Secure',
              body: `We operate out of security tier 2 and 3 data centers equipped with 24/7 onsite CCTV and armed security guards, ensuring the physical security of your data.`,
            },
            {
              icon: 'i-tabler-server',
              header: 'Reliable',
              body: `We've operated physical hardware for 6 years across a dozen data center facilities. Our well-experienced team is available to resolve any problem, hardware or otherwise. `,
            },
          ].map(({ icon, header, body }) => (
            <div
              className="shadow-lg ring-gray-200 ring-1 rounded text-center pb-10 px-4 relative bg-white"
              key={icon}
            >
              <div className="w-20 h-20 bg-white ring-gray-200 ring-1 shadow-md rounded-full -translate-y-1/2 absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className={` ${icon} text-4xl`} />
              </div>
              <h3 className="font-display text-xl text-gray-7 pt-18">
                {header}
              </h3>
              <p className="text-gray-500 font-400 mt-2">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        className="bg-cover relative"
        style={{ backgroundImage: `url(${BGImage})` }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative py-18 md:py-24 lg:py-32 flex flex-col items-center gap-8 container mx-auto">
          <h2 className="text-white text-3xl font-display lh-relaxed text-center">
            Deploy a cloud H100 today from just{' '}
            <strong className="inline-block md:block">$2.50/hour.</strong>
          </h2>
          <div className="flex gap-1">
            <Link
              to="/deploy"
              className="rounded bg-white px-6 py-2.5 font-display font-medium text-neutral-6 select-none"
            >
              Get Started
            </Link>
            <a
              target="_blank"
              href="https://h100cloud.com"
              className="rounded border-white border-2 px-6 py-2.5 font-display font-medium text-white select-none"
            >
              Custom Requests
            </a>
          </div>
        </div>
      </section>
      <footer className="bg-[rgb(11,23,39)] pt-18">
        <div className="grid md:grid-cols-[1fr_300px] mb-12 container mx-auto">
          <div>
            <h3 className="px-4 text-white font-display text-xl">H100Cloud</h3>
            <p className="px-4 text-white/40 mt-4 max-w-prose">
              H100cloud provides startups, AI labs, and enterprises access to a
              massive NVIDIA GPU cloud colocated in the heart of the United
              States managed by Strategic Infrastructure Holdings, completely
              on-demand.
            </p>
          </div>
          <div className="px-4">
            <ul className="grid grid-cols-2 mt-4 text-white/40">
              {[
                { text: 'About', href: 'https://www.strategicinfra.com/' },
                { text: 'Deploy', href: '/deploy' },
                { text: 'Contact', href: 'mailto:hello@h100cloud.com' },
                {
                  text: 'Documentation',
                  href: 'https://tensordock.gitbook.io/whitelabeled-storefronts-tensordock/',
                },
              ].map(({ text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="inline-block py-1 hover:underline hover:text-white/80"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-8 border-t-[1px] border-white/40">
          <div className="px-4 text-white/40 text-center">
            Copyright © 2024{' '}
            <a
              className="text-white/80 hover:underline"
              href="https://h100cloud.com"
            >
              H100cloud
            </a>
            <br />
            All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
