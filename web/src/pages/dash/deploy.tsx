import { Link } from 'react-router-dom';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { z } from 'zod';

import { DashBlock } from '../../components/dash';
import Head from '../../components/head';
import { INFRASTRUCTURE_URL } from '../../constants/external';
// import { Configuration, validConfigurations } from '../../constants/datacenter';

// TODO: this whole thing

// const deployFormSchema = z.object({
//   configuration: z
//     .any()
//     .refine((config) => validConfigurations.includes(config)),
// });

export default function DeployPage() {
  // const { register, handleSubmit } = useForm();

  // const onSubmit: SubmitHandler<FormData> = async (data) => {};

  return (
    <>
      <Head title={`Deploy a cloud GPU`} />
      <DashBlock header="Deploy a cloud H100 SXM5 GPU">
        <div className="mt-4 text-gray-500 font-400">
          <p>
            Premium OEM-manufactured servers. Tier 3 data centers. NVSwitch
            fabric passed through when you deploy 8 GPUs.
          </p>
          <Link
            to={INFRASTRUCTURE_URL}
            target="_blank"
            className="mt-2 inline-block select-none rounded px-3 py-1 text-blue-500 font-300 font-display ring-1 ring-gray-300"
          >
            Our Infrastructure
          </Link>
        </div>
      </DashBlock>
      <form
        className="grid gap-4 lg:grid-cols-[1fr_20rem]"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <DashBlock>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
          voluptas sit ea reprehenderit distinctio odit eius nobis, voluptate
          repellat soluta illo, id necessitatibus provident temporibus nulla
          cupiditate, maxime voluptatem pariatur? Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Rem, dicta veniam omnis quas maxime
          accusamus? Repudiandae corrupti ab exercitationem placeat asperiores
          deserunt dolorem excepturi, odio neque. Praesentium, eligendi?
          Consequuntur, vel?
        </DashBlock>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <DashBlock>
            <h3 className="text-xl font-display">Your Server</h3>
            <p className="mt-4 text-neutral-500">
              Pricing details will appear once you select a configuration.
            </p>
            <p className="mt-2 text-neutral-500">
              Your actual charge will be pro-rated to the millisecond your
              server is deployed.
            </p>
          </DashBlock>
        </div>
      </form>
    </>
  );
}
