import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { DashBlock } from '../../components/dash';
import Head from '../../components/head';
import ConfigurationSelectInput from '../../components/input/deploy-configuration';
import OperatingSystemSelectInput from '../../components/input/deploy-os';
import TextInput from '../../components/input/text-input';
import { SHORT_COMPANY_NAME } from '../../constants/branding';
import {
  DeployConfiguration,
  DEFAULT_PORTS,
  OPERATING_SYSTEMS,
  OS_DETAILS,
} from '../../constants/datacenter';
import {
  CONTACT_EMAIL,
  INFRASTRUCTURE_URL,
  SALES_EMAIL,
} from '../../constants/external';
import { ROUTES } from '../../constants/pages';
import useDeployConfigurations from '../../hooks/use-deploy-configurations';
import useUserInfo from '../../hooks/use-user-info';

const portSchema = ({ min, max }: { min?: number; max?: number } = {}) =>
  z
    .string()
    .regex(/^[1-9][0-9]*$/, 'Please enter a valid port')
    .refine(
      (val) => min === undefined || parseInt(val) >= min,
      `Must be at least ${min}`
    )
    .refine(
      (val) => max === undefined || parseInt(val) <= max,
      `Must be at most ${max}`
    );

const deployFormSchema = z
  .object({
    configuration: z.string(),
    os: z.enum(OPERATING_SYSTEMS, {
      message: 'Please select an operating system',
    }),
    adminPassword: z
      .string()
      .min(1, 'Please provide an admin password')
      .min(8, 'Must be at least 8 characters')
      .refine(
        (password) =>
          /[A-Z]/.test(password) ||
          /[\W_]/.test(password) ||
          /\d/.test(password),
        'Password must contain at least 1 uppercase letter, symbol, or number'
      ),
    serverName: z.string().min(1, 'Please name your server'),
    portForwards: z.array(
      z.object({
        from: portSchema({ min: 20019, max: 20099 }).refine(
          (port) => DEFAULT_PORTS.findIndex(({ from }) => from === port) === -1,
          'Cannot override default ports'
        ),
        to: portSchema({ min: 0, max: 65535 }),
      })
    ),
  })
  .superRefine(({ os, configuration }, ctx) => {
    const minStorage = OS_DETAILS[os].minStorageGB;
    if (minStorage === undefined || configuration === undefined) return;

    const config = JSON.parse(configuration) as DeployConfiguration;

    if (config.storage < minStorage) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: minStorage,
        type: 'number',
        inclusive: true,
        message: `Please ensure you have enough storage space (${minStorage.toFixed(0)} GB) for our ${os} operating system template`,
        path: ['configuration'],
      });
    }
  });

type DeployFormValues = z.infer<typeof deployFormSchema>;

export default function DeployPage() {
  const { configurations } = useDeployConfigurations();
  const { info } = useUserInfo();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeployFormValues>({
    resolver: zodResolver(deployFormSchema),
    defaultValues: {
      adminPassword: '',
      serverName: '',
      portForwards: [],
    },
  });

  const selectedConfigurationString = useWatch({
    control,
    name: 'configuration',
  });
  const selectedConfiguration = useMemo(
    () =>
      selectedConfigurationString === undefined
        ? undefined
        : (JSON.parse(selectedConfigurationString) as DeployConfiguration),
    [selectedConfigurationString]
  );

  const accountBalanceTooLow = useMemo(
    () => info !== undefined && info.balance <= 0,
    [info]
  );

  const onSubmit = useCallback<SubmitHandler<DeployFormValues>>(
    async ({ configuration: configString, ...form }) => {
      if (!configString) return;

      const configuration = JSON.parse(configString) as DeployConfiguration;
      console.log({ ...form, configuration });
      // TODO: ahhh make request and such
    },
    []
  );

  const portForwards = useFieldArray({ control, name: 'portForwards' });

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
        <div className="space-y-4">
          <DashBlock>
            <h3 className="text-xl font-display">Select a configuration</h3>
            <div className="mb-4 mt-2 space-y-2">
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
            {configurations && (
              <Controller
                control={control}
                name="configuration"
                render={(props) => (
                  <ConfigurationSelectInput
                    configurations={configurations}
                    field={props.field}
                    errorMessage={errors.configuration?.message}
                  />
                )}
              />
            )}
            {configurations === undefined && (
              <div className="px-6 py-4 text-gray-500">
                Loading configurations...
              </div>
            )}
          </DashBlock>
          <DashBlock>
            <h3 className="mb-6 text-xl font-display">
              Select an operating system
            </h3>
            <Controller
              control={control}
              name="os"
              render={({ field }) => (
                <OperatingSystemSelectInput
                  field={field}
                  errorMessage={errors.os?.message}
                />
              )}
            />
          </DashBlock>
          <DashBlock>
            <h3 className="text-xl font-display">Configure details</h3>
            <div className="mt-6 flex flex-col gap-4">
              <TextInput disabled value="admin" label="Admin Username" />
              <TextInput
                {...register('adminPassword')}
                type="password"
                placeholder="••••••••"
                errorMessage={errors.adminPassword?.message}
                label="Admin Password"
              />
              <TextInput
                {...register('serverName')}
                placeholder={`My ${SHORT_COMPANY_NAME} Server`}
                errorMessage={errors.serverName?.message}
                label="Name"
              />
              <h4 className="mt-6 text-gray-700 font-semibold">
                Configure port forwards
              </h4>
              <p className="text-sm text-gray-500">
                You may forward up to 64 ports. The external port is where
                requests will enter; the internal port is where you set the
                requests to be forwarded to. We've by default included an SSH
                port (a port forwarded to port 22) so that you will be able to
                access your instance once created.
              </p>
              <div className="mt-2 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_1fr_40px] gap-2 text-sm text-gray-500">
                  <div>External Port</div>
                  <div>Internal Port</div>
                </div>
                {DEFAULT_PORTS.map(({ from, to, id }) => (
                  <div key={id} className="grid grid-cols-[1fr_1fr_40px] gap-2">
                    <TextInput disabled value={from} />
                    <TextInput disabled value={to} />
                  </div>
                ))}
                {portForwards.fields.map((forward, idx) => (
                  <div
                    key={forward.id}
                    className="grid grid-cols-[1fr_1fr_40px] gap-2"
                  >
                    <TextInput
                      {...register(`portForwards.${idx}.from`)}
                      placeholder="From"
                      errorMessage={errors.portForwards?.[idx]?.from?.message}
                    />
                    <TextInput
                      {...register(`portForwards.${idx}.to`)}
                      placeholder="To"
                      errorMessage={errors.portForwards?.[idx]?.to?.message}
                    />
                    <button
                      type="button"
                      onClick={() => portForwards.remove(idx)}
                      className="i-tabler-trash my-[10px] h-[20px] w-[40px] text-red-500 opacity-50 transition-opacity hover:opacity-100"
                    >
                      <div className="sr-only">Delete</div>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => portForwards.append({ from: '', to: '' })}
                className="rounded px-4 py-2 ring-1 ring-gray-300 transition-colors hover:bg-gray-100"
              >
                <div className="i-tabler-plus mr-2 inline-block translate-y-[2px]" />
                Add forwarding
              </button>
            </div>
          </DashBlock>
        </div>
        <div className="lg:sticky lg:top-4 lg:self-start">
          <DashBlock>
            <h3 className="text-xl font-display">Your Server</h3>
            {selectedConfiguration ? (
              <div className="mt-4 flex flex-col">
                <p className="text-sm text-gray-500">
                  Your actual charge will be pro-rated to the millisecond your
                  server is deployed.
                </p>
                <p className="mt-4">
                  {selectedConfiguration.vcpu} vCPUs, Intel Xeon Platinum 8470 @
                  3.8 GHz boost
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <p className="inline-flex items-center gap-2">
                    <span className="i-tabler-stack-2" />
                    {selectedConfiguration.ram} GB DDR5
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <span className="i-tabler-database" />
                    {selectedConfiguration.storage} GB NVMe SSD
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <span className="i-tabler-bolt" />
                    {selectedConfiguration.bandwidth} Gbps
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <span className="i-tabler-map-pin" />
                    Dallas, Texas
                  </p>
                </div>
                <p className="mt-8 flex font-bold">
                  Running Cost
                  <span className="ml-auto tabular-nums">
                    ${selectedConfiguration.price.toFixed(2)}/hr
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Cost per hour when the VM is running.
                </p>
                <p className="mt-6 flex font-bold">
                  Stopped Cost
                  <span className="ml-auto tabular-nums">
                    ${(selectedConfiguration.storage * 0.0001).toFixed(2)}/hr
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Stopped VMs incur reduced storage fees, but the availability
                  of GPUs on the same node is not guaranteed.
                </p>
                <p className="mt-8 flex font-bold">
                  Account Balance
                  <span className="ml-auto tabular-nums">
                    ${info?.balance?.toFixed(2)}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Deposit more funds{' '}
                  <Link
                    to={ROUTES.accountDeposit}
                    className="font-medium underline transition-colors hover:text-gray-500"
                  >
                    here
                  </Link>
                  .
                </p>
                <p className="mt-6 text-sm text-gray-500">
                  Email us at{' '}
                  <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a> if you are
                  interested in committing to a monthly or longer contract. Save
                  up to 30%.
                </p>
                <button
                  type="submit"
                  disabled={accountBalanceTooLow}
                  className={`mt-8 rounded px-4 py-2 font-medium font-display transition-colors ${accountBalanceTooLow ? 'ring-1 ring-gray-300 text-blue-500' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
                >
                  {accountBalanceTooLow
                    ? 'Balance of $0.00 too low'
                    : 'Deploy Server'}
                </button>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">
                Pricing details will appear once you select a configuration.
              </p>
            )}
          </DashBlock>
        </div>
      </form>
    </>
  );
}
