import { SHORT_COMPANY_NAME } from '../../constants/branding';

import CodeAPIImage from '../../assets/img/code_api.png';
import DeploymentsImage from '../../assets/img/deployments.png';
import MoneyImage from '../../assets/img/money.png';

export default function BodySection() {
  return (
    <>
      <section className="bg-primary-50 px-4 pt-18">
        <div className="mx-auto w-full md:w-160 sm:w-120">
          <h2 className="text-center text-2xl text-gray-7 font-medium font-display lg:text-4xl md:text-3xl">
            GPU platform of the future
          </h2>
          <p className="mt-4 max-w-prose text-lg text-gray-500">
            The industry's greatest hardware available at prices 80% less than
            large clouds. You can save even more when you purchase a long-term
            contract.
          </p>
        </div>
      </section>
      <section className="bg-primary-50 py-18">
        <ul className="mx-auto max-w-lg w-full flex flex-col gap-18 px-4 lg:max-w-4xl">
          {[
            {
              image: MoneyImage,
              alt: 'Save',
              icon: 'i-tabler-bulb',
              tagline: 'SAVE',
              header: <>Low prices</>,
              body: 'From only $0.50/hr, our virtual machines are affordable and can be scaled when you need them to.',
            },
            {
              image: CodeAPIImage,
              alt: 'API',
              icon: 'i-tabler-code',
              tagline: 'BUILD',
              header: <>Documented API</>,
              body: 'Deploy and manage VMs programatically with our well-documented API.',
            },
            {
              image: DeploymentsImage,
              alt: 'Deployments',
              icon: 'i-tabler-rocket',
              tagline: 'DEPLOY',
              header: <>Dead-simple deployments</>,
              body: 'Our virtualization software makes it easy to get up and running in minutes.',
            },
          ].map(({ image, alt, icon, tagline, header, body }, idx) => (
            <li key={tagline} className="grid items-center lg:grid-cols-2">
              <img
                src={image}
                alt={alt}
                className={`w-full px-12 grayscale ${idx % 2 === 0 ? '' : 'lg:order-last'}`}
              />
              <div className="mt-4 text-gray-7">
                <div className="flex items-center gap-2 text-xl text-primary-500 font-medium font-display">
                  <div className={`${icon} text-2xl`} />
                  {tagline}
                </div>
                <h3 className="mt-2 text-2xl font-display">{header}</h3>
                <p className="mt-4 text-gray-500">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-primary-50/25 px-4 py-16 text-gray-7">
        <h2 className="text-center text-2xl font-400 font-display">
          All the bells and whistles
        </h2>
        <p className="mt-4 text-center text-xl text-gray-500 font-300">
          Available right out of the box with {SHORT_COMPANY_NAME}.
        </p>
        <div className="grid mx-auto mt-20 gap-20 container lg:grid-cols-3">
          {[
            {
              icon: 'i-tabler-brand-ubuntu',
              header: 'Configurable OS',
              body: 'Select from a range of operating systems depending on your needs, from Ubuntu to Windows.',
            },
            {
              icon: 'i-tabler-lock',
              header: 'Secure',
              body: `${SHORT_COMPANY_NAME} has a team dedicated to ensuring that the contents of your VMs are safe and secure.`,
            },
            {
              icon: 'i-tabler-server',
              header: 'Reliable',
              body: `Choose from a variety of GPU models all at affordable prices, and all simple to deploy on ${SHORT_COMPANY_NAME}.`,
            },
          ].map(({ icon, header, body }) => (
            <div
              className="relative rounded-card bg-white px-4 pb-10 text-center shadow-lg ring-1 ring-gray-200"
              key={icon}
            >
              <div className="absolute left-1/2 h-20 w-20 flex items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 -translate-x-1/2 -translate-y-1/2">
                <div className={` ${icon} text-4xl`} />
              </div>
              <h3 className="pt-18 text-xl text-gray-7 font-display">
                {header}
              </h3>
              <p className="mt-2 text-gray-500 font-400">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
