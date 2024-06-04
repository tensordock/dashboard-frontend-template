import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { DashBlock } from '../../components/dash';
import Head from '../../components/head';
import { Configuration } from '../../constants/datacenter';
import { CONTACT_EMAIL, INFRASTRUCTURE_URL } from '../../constants/external';
import useDeployConfigurations from '../../hooks/use-deploy-configurations';

const deployFormSchema = z.object({
  configuration: z.string(),
});

type DeployFormValues = z.infer<typeof deployFormSchema>;

export default function DeployPage() {
  const { configurations } = useDeployConfigurations();
  // const { info } = useUserInfo();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<DeployFormValues>({
    resolver: zodResolver(deployFormSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<DeployFormValues> = async ({
    configuration: configString,
  }) => {
    if (!configString) return;

    const configuration = JSON.parse(configString) as Configuration;
    console.log(configuration);
  };

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
            className="mt-2 inline-block select-none rounded px-3 py-1 text-primary-500 font-300 font-display ring-1 ring-gray-300"
          >
            Our Infrastructure
          </Link>
        </div>
      </DashBlock>
      <form
        className="grid gap-4 lg:grid-cols-[1fr_20rem]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DashBlock>
          <h3 className="text-xl font-display">Select a configuration</h3>
          <div className="mt-4 space-y-2">
            <span className="block text-gray-500 md:inline">
              Need InfiniBand or custom deployments?
            </span>
            <Link
              to={`mailto:${CONTACT_EMAIL}`}
              target="_blank"
              className="inline-block select-none rounded px-3 py-1 text-primary-500 font-300 font-display ring-1 ring-gray-300 md:ml-4"
            >
              Email us
            </Link>
          </div>
          <Controller
            control={control}
            name="configuration"
            render={({ field: { onChange, ref, value, disabled } }) => (
              <ul className="mt-6 flex flex-col gap-4" ref={ref}>
                {configurations &&
                  configurations.map((config) => {
                    const stringified = JSON.stringify(config);
                    const isSelected = stringified === value;
                    return (
                      <li
                        key={JSON.stringify(config)}
                        className="inline-flex flex-col"
                      >
                        <button
                          type="button"
                          onClick={() => onChange(stringified)}
                          disabled={disabled}
                          className={`rounded-lg px-6 py-8 text-left flex flex-col transition ring-primary-500/30 ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-primary-500/10 hover:bg-primary-500/20 ring-1'}`}
                        >
                          <div>
                            <h3 className="text-xl font-medium font-display">
                              {config.gpu_count}x {config.gpu_model}
                            </h3>
                            <div
                              className={`mt-3 text-sm ${isSelected ? '' : 'text-gray-500'}`}
                            >
                              <p className="inline-flex items-center gap-2">
                                <div className="i-tabler-cpu" />
                                {config.vcpu} vCPUs, Intel Xeon Platinum 8470 @
                                3.8 GHz boost
                              </p>
                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                <p className="inline-flex items-center gap-2">
                                  <div className="i-tabler-stack-2" />
                                  {config.ram} GB DDR5
                                </p>
                                <p className="inline-flex items-center gap-2">
                                  <div className="i-tabler-database" />
                                  {config.storage} GB NVMe SSD
                                </p>
                                <p className="inline-flex items-center gap-2">
                                  <div className="i-tabler-bolt" />
                                  {config.bandwidth} Gbps
                                </p>
                                <p className="inline-flex items-center gap-2">
                                  <div className="i-tabler-map-pin" />
                                  Dallas, Texas
                                </p>
                              </div>
                            </div>
                            {config.nvlink && (
                              <p
                                className={`rounded px-4 py-1 font-display transition-colors mt-2 inline-block ${isSelected ? 'ring-1 ring-white/30' : 'bg-primary-500/20 text-primary-500'}`}
                              >
                                GPU-to-GPU NVSwitch Fabric
                              </p>
                            )}
                          </div>
                          <div className="mt-6 text-3xl font-display">
                            ${config.price.toFixed(2)}/hr
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            )}
          />
        </DashBlock>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <DashBlock>
            <h3 className="text-xl font-display">Your Server</h3>
            {isValid ? (
              <>hello!</>
            ) : (
              <>
                <p className="mt-4 text-gray-500">
                  Pricing details will appear once you select a configuration.
                </p>
                <p className="mt-2 text-gray-500">
                  Your actual charge will be pro-rated to the millisecond your
                  server is deployed.
                </p>
              </>
            )}
          </DashBlock>
        </div>
      </form>
    </>
  );
}
