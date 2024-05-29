import CodeAPIImage from '../../assets/img/code_api.png';
import DeploymentsImage from '../../assets/img/deployments.png';
import MoneyImage from '../../assets/img/money.png';

export default function BodySection() {
  return (
    <>
      <section className="bg-blue-50 px-4 pt-18">
        <div className="mx-auto w-full md:w-160 sm:w-120">
          <h2 className="text-center text-2xl text-gray-7 font-medium font-display lg:text-4xl md:text-3xl">
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
          <p className="max-w-prose text-lg text-gray-500">
            Through H100cloud, you get to access cloud resources that previously
            only long-term contract customers could access —{' '}
            <b>available on-demand, pro-rated to the microsecond</b>.
          </p>
        </div>
      </section>
      <section className="bg-blue-50 py-18">
        <ul className="mx-auto max-w-lg w-full flex flex-col gap-18 px-4 lg:max-w-4xl">
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
            <li key={tagline} className="grid items-center lg:grid-cols-2">
              <img
                src={image}
                alt={alt}
                className={`w-full px-12 grayscale ${idx % 2 === 0 ? '' : 'lg:order-last'}`}
              />
              <div className="mt-4 text-gray-7">
                <div className="flex items-center gap-2 text-xl text-blue-500 font-medium font-display">
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
      <section className="bg-blue-50/25 px-4 py-16 text-gray-7">
        <h2 className="text-center text-2xl font-400 font-display">
          All the bells and whistles
        </h2>
        <p className="mt-4 text-center text-xl text-gray-500 font-300">
          Available right out of the box with H100cloud.
        </p>
        <div className="grid mx-auto mt-20 gap-20 container lg:grid-cols-3">
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
              className="relative rounded bg-white px-4 pb-10 text-center shadow-lg ring-1 ring-gray-200"
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
