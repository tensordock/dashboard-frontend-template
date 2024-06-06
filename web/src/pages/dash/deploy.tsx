import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { DashBlock } from '../../components/dash';
import Head from '../../components/head';
import ConfigurationSelectInput from '../../components/input/deploy-configuration';
import OperatingSystemSelectInput from '../../components/input/deploy-os';
import TextInput from '../../components/input/text-input';
import { SHORT_COMPANY_NAME } from '../../constants/branding';
import { DEFAULT_PORTS, DeployConfiguration } from '../../constants/datacenter';
import {
  CONTACT_EMAIL,
  INFRASTRUCTURE_URL,
  SALES_EMAIL,
} from '../../constants/external';
import { ROUTES } from '../../constants/pages';
import useDeployConfigurations from '../../hooks/use-deploy-configurations';
import useUserInfo from '../../hooks/use-user-info';
import * as api from '../../util/api';

type DeployFormValues = z.infer<typeof api.deploySchema>;

export default function DeployPage() {
  const navigate = useNavigate();

  const { configurations } = useDeployConfigurations();
  const { info } = useUserInfo();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeployFormValues>({
    resolver: zodResolver(api.deploySchema),
    defaultValues: {
      adminPassword: '',
      serverName: '',
      portForwards: [],
      cloudinitScript: '',
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
    async (values) => {
      const toastId = toast.loading('Deploying...');
      try {
        await api.deploy(values);
        toast.success('Successfully deployed!', { id: toastId });
        navigate(ROUTES.list);
      } catch (err) {
        if (err instanceof Error)
          toast.error(`${err.message}.`, { id: toastId });
      }
    },
    [navigate]
  );

  const portForwards = useFieldArray({ control, name: 'portForwards' });

  const [isAdvancedOpen, setAdvancedOpen] = useState(false);

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
              render={({ field }) => {
                return (
                  <OperatingSystemSelectInput
                    field={field}
                    errorMessage={errors.os?.message}
                  />
                );
              }}
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
              <h4 className="mt-6 text-gray-700 font-display">
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
            <button
              type="button"
              onClick={() => setAdvancedOpen((o) => !o)}
              className="mt-8 text-left font-display"
            >
              <div
                className={`i-tabler-settings mr-2 inline-block translate-y-0.5 transition-transform duration-300 ${isAdvancedOpen ? 'rotate-90' : ''}`}
              />
              Click for more advanced options
            </button>
            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="flex flex-col overflow-hidden"
                >
                  <label className="flex flex-col p-1 pt-4">
                    <div className="mb-1 text-sm text-gray-500">
                      Cloudinit Script
                    </div>
                    <textarea
                      {...register('cloudinitScript')}
                      placeholder={`write_files:
  - path: /home/user/cloudinit_website/index.html
    permissions: '0777'
    content: |
      Woohoo! This site is working!
    owner: user:user 
runcmd:
  - docker run -d --restart unless-stopped --stop-timeout 300 -v /home/user/cloudinit_website:/usr/share/nginx/html:ro -p 80:80 --name default_container nginx`}
                      className="rounded px-2 py-1 text-sm font-mono ring-1 ring-gray-300"
                      rows={11}
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
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
