import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { DashBlock } from '../../components/dash-block';
import DeploySummary from '../../components/deploy-summary';
import Head from '../../components/head';
import DeployLocationInput from '../../components/input/deploy-location';
import OperatingSystemSelectInput from '../../components/input/deploy-os';
import DeploySpecInput from '../../components/input/deploy-spec';
import TextInput from '../../components/input/text-input';
import * as constants from '../../constants';
import useAuth from '../../hooks/use-auth';
import useHostnodes from '../../hooks/use-hostnodes';
import useUserInfo from '../../hooks/use-user-info';
import * as api from '../../util/api';
import ButtonLink from '../../components/common/button-link';
import Button from '../../components/common/button';

type DeployFormValues = z.infer<typeof api.deploySchema>;

export default function DeployPage() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DeployFormValues>({
    resolver: zodResolver(api.deploySchema),
    defaultValues: {
      adminPassword: '',
      serverName: '',
      portForwards: [],
      cloudinitScript: '',
      specs: constants.DEFAULT_DEPLOY_SPECS,
    },
  });

  const [specs, hostnode, portForwards] = useWatch({
    control,
    name: ['specs', 'hostnode', 'portForwards'],
  });

  // clear hostnode when changing GPUs
  useEffect(() => {
    setValue('hostnode', undefined!);
  }, [specs.gpu_model, setValue]);

  const { hostnodes } = useHostnodes({
    minGPUCount: specs.gpu_count,
    minRAM: specs.ram,
    minStorage: specs.storage,
    minvCPUs: specs.vcpu,
    minVRAM: api.getVRAM(specs.gpu_model),
    requiresRTX: specs.gpu_model.includes('rtx'),
  });

  // tweak port forwards when changing hostnodes
  useEffect(() => {
    if (!hostnode || !hostnodes || !(hostnode in hostnodes)) return;

    const availablePorts = hostnodes[hostnode].networking.ports;

    // if nothing is set, add default ports
    if (portForwards.length === 0) {
      setValue(
        'portForwards',
        [22, 3389, 8888].map((internalPort, idx) => ({
          from: availablePorts[idx].toFixed(0),
          to: internalPort.toFixed(0),
        }))
      );
      return;
    }

    let needsSwapping = false;
    for (const { from } of portForwards) {
      if (!availablePorts.includes(Number(from))) {
        needsSwapping = true;
        break;
      }
    }

    if (!needsSwapping) return;

    const swappablePorts = availablePorts.filter(
      (port) => !portForwards.find(({ from }) => Number(from) === port)
    );

    setValue(
      'portForwards',
      portForwards.map(({ from, to }, idx) => {
        if (!availablePorts.includes(Number(from))) {
          return { from: swappablePorts[idx].toFixed(0), to };
        } else {
          return { from, to };
        }
      })
    );
  }, [hostnode, hostnodes, portForwards, setValue]);

  const { info } = useUserInfo();
  const accountBalanceTooLow = useMemo(
    () => info !== undefined && info.balance <= 1,
    [info]
  );

  const { locations, suggestedLocations } = useMemo(
    () =>
      hostnodes && specs
        ? api.generateLocations(specs, hostnodes)
        : { locations: undefined, suggestedLocations: undefined },
    [hostnodes, specs]
  );

  const onSubmit = useCallback<SubmitHandler<DeployFormValues>>(
    async (values) => {
      if (!hostnodes) return;
      const toastId = toast.loading('Deploying...');
      try {
        await api.deploy(values, hostnodes);
        toast.success('Successfully deployed!', { id: toastId });
        navigate(constants.ROUTES.list);
      } catch (err) {
        if (err instanceof Error)
          toast.error(`${err.message}.`, { id: toastId });
      }
    },
    [navigate, hostnodes]
  );

  const portForwardsFieldArray = useFieldArray({
    control,
    name: 'portForwards',
  });

  const [isAdvancedOpen, setAdvancedOpen] = useState(false);

  const { loginInfo } = useAuth();

  return (
    <>
      <Head title={`Deploy a cloud GPU`} />
      <DashBlock header="Deploy a new cloud GPU">
        <div className="mt-4 text-gray-500 font-400">
          <p>Customize your own server, fully a la carte.</p>
          <ButtonLink
            to={constants.INFRASTRUCTURE_URL}
            variant="secondary"
            scaleUp={false}
            target="_blank"
            className="mt-2"
          >
            Our Infrastructure
          </ButtonLink>
        </div>
      </DashBlock>
      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
        {constants.GPU_SWITCHING_ALLOWED && (
          <DashBlock>
            <h3 className="text-xl font-display">Select an available GPU</h3>
            <div className="mb-4 mt-2 space-y-2">
              <span className="block text-gray-500 md:inline">
                Need InfiniBand or custom deployments?
              </span>
              <ButtonLink
                to={`mailto:${constants.CONTACT_EMAIL}`}
                target="_blank"
                variant="secondary"
                scaleUp={false}
                className="md:ml-4"
              >
                Email us
              </ButtonLink>
            </div>
            <Controller
              control={control}
              name="specs.gpu_model"
              render={({ field: { value, onChange } }) => (
                <div className="flex flex-wrap items-stretch gap-4">
                  {constants.ALLOWED_GPUS.map((gpu) => {
                    const isSelected = gpu === value;
                    return (
                      <button
                        key={gpu}
                        type="button"
                        className={`min-w-48 flex flex-grow-1 flex-col items-start px-4 text-lg font-display py-8 rounded-bigbtn transition-colors text-left ${isSelected ? 'bg-primary-500 text-white ring-primary-300' : 'bg-primary-500/10'}`}
                        onClick={() => onChange(gpu)}
                      >
                        {constants.GPU_INFO[gpu].shortName}
                        <div className="mt-auto pt-2">
                          <div
                            className={`px-3 py-1 bg-primary-500/20 rounded-btn text-base ${isSelected ? 'text-white ring-1 ring-white/30' : 'text-primary-500'}`}
                          >
                            {api.getVRAM(gpu)}GB
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </DashBlock>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Controller
            control={control}
            name="specs.gpu_count"
            render={({ field }) => (
              <DeploySpecInput
                field={field}
                label="GPU Count"
                errorMessage={errors.specs?.gpu_count?.message}
                options={constants.ALLOWED_GPU_COUNT}
                disabled={constants.ALLOWED_GPU_COUNT.length === 1}
              />
            )}
          />
          <Controller
            control={control}
            name="specs.ram"
            render={({ field }) => (
              <DeploySpecInput
                field={field}
                label="RAM"
                errorMessage={errors.specs?.ram?.message}
                options={constants.ALLOWED_RAM_GB}
                disabled={constants.ALLOWED_RAM_GB.length === 1}
                transformValues={(ram) => `${ram} GB`}
              />
            )}
          />
          <Controller
            control={control}
            name="specs.vcpu"
            render={({ field }) => (
              <DeploySpecInput
                field={field}
                label="vCPU Count"
                errorMessage={errors.specs?.vcpu?.message}
                options={constants.ALLOWED_VCPU_COUNT}
                disabled={constants.ALLOWED_VCPU_COUNT.length === 1}
              />
            )}
          />
          <Controller
            control={control}
            name="specs.storage"
            render={({ field }) => (
              <DeploySpecInput
                field={field}
                label="NVMe SSD"
                errorMessage={errors.specs?.storage?.message}
                options={constants.ALLOWED_STORAGE_GB}
                disabled={constants.ALLOWED_STORAGE_GB.length === 1}
                transformValues={(ram) => `${ram} GB`}
              />
            )}
          />
        </div>
        <DashBlock>
          <h3 className="select-none text-xl font-display">
            Select a location
          </h3>
          {!locations && (
            <div className="mt-4 flex flex-col items-center rounded-card bg-primary-500/10 py-8">
              <div className="i-tabler-loader-2 animate-spin text-4xl" />
            </div>
          )}

          {locations && suggestedLocations && (
            <Controller
              control={control}
              name="hostnode"
              render={({ field }) => (
                <DeployLocationInput
                  field={field}
                  locations={locations}
                  suggestedLocations={suggestedLocations}
                  selectedGpuModel={specs.gpu_model}
                />
              )}
            />
          )}
        </DashBlock>
        <DashBlock>
          <h3 className="mb-6 select-none text-xl font-display">
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
          <h3 className="select-none text-xl font-display">
            Configure details
          </h3>
          <div className="mt-6 flex flex-col gap-4">
            <TextInput disabled value="user" label="Admin Username" />
            <TextInput
              {...register('adminPassword')}
              type="password"
              placeholder="••••••••"
              errorMessage={errors.adminPassword?.message}
              label="Admin Password"
            />
            <TextInput
              {...register('serverName')}
              placeholder={`My ${constants.SHORT_COMPANY_NAME} Server`}
              errorMessage={errors.serverName?.message}
              label="Name"
            />
            <h4 className="mt-6 text-gray-700 font-display">
              Configure port forwards
            </h4>
            {!hostnode && (
              <p className="text-gray-500">Please select a location first.</p>
            )}
            {hostnode && (
              <>
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
                  {portForwardsFieldArray.fields.map((forward, idx) => {
                    const swappablePorts =
                      hostnodes?.[hostnode]?.networking.ports ?? [];
                    return (
                      <div
                        key={forward.id}
                        className="grid grid-cols-[1fr_1fr_40px] gap-2"
                      >
                        <label className="flex flex-col">
                          <select
                            {...register(`portForwards.${idx}.from`)}
                            className="rounded-input bg-white px-4 py-2 ring-1 ring-gray-300"
                          >
                            {swappablePorts.map((externalPort) => (
                              <option
                                key={externalPort}
                                value={externalPort.toFixed(0)}
                              >
                                {externalPort}
                              </option>
                            ))}
                          </select>
                          <AnimatePresence>
                            {errors.portForwards?.[idx]?.from?.message && (
                              <m.div
                                className="overflow-auto"
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                              >
                                <div className="mt-1 text-sm text-red-500">
                                  {errors.portForwards?.[idx]?.from?.message}.
                                </div>
                              </m.div>
                            )}
                          </AnimatePresence>
                        </label>
                        <TextInput
                          {...register(`portForwards.${idx}.to`)}
                          placeholder="To"
                          errorMessage={errors.portForwards?.[idx]?.to?.message}
                        />
                        <button
                          type="button"
                          onClick={() => portForwardsFieldArray.remove(idx)}
                          className="i-tabler-trash my-[10px] h-[20px] w-[40px] text-red-500 opacity-50 transition-opacity disabled:hidden hover:opacity-100"
                          disabled={idx === 0}
                        >
                          <div className="sr-only">Delete</div>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    portForwardsFieldArray.append({ from: '', to: '' })
                  }
                  disabled={portForwards.length >= 64}
                  className="rounded-btn px-4 py-2 ring-1 ring-gray-300 transition-colors hover:bg-gray-100"
                >
                  <div className="i-tabler-plus mr-2 inline-block translate-y-[2px]" />
                  Add forwarding
                </button>
              </>
            )}
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
              <m.div
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
                    className="rounded-input px-2 py-1 text-sm font-mono ring-1 ring-gray-300"
                    rows={11}
                  />
                </label>
              </m.div>
            )}
          </AnimatePresence>
        </DashBlock>

        <DashBlock>
          <h3 className="select-none text-xl font-display">Your Server</h3>
          {specs.gpu_model ? (
            <div className="mt-4 flex flex-col">
              <p className="text-sm text-gray-500">
                Your actual charge will be pro-rated to the millisecond your
                server is deployed.
              </p>
              {hostnodes?.[hostnode] && (
                <div className="mt-6">
                  <DeploySummary
                    selectedGPU={specs.gpu_model}
                    specs={specs}
                    hostnodeInfo={hostnodes[hostnode]}
                  />
                </div>
              )}
              <p className="mt-8 flex font-bold font-display">
                Account Balance
                <span className="ml-auto font-sans tabular-nums">
                  {loginInfo?.loggedIn
                    ? `$${info?.balance?.toFixed(2)}`
                    : 'N/A'}
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Deposit more funds{' '}
                <Link
                  to={constants.ROUTES.accountDeposit}
                  className="font-medium underline transition-colors hover:text-gray-500"
                >
                  here
                </Link>
                .
              </p>
              <p className="mt-6 text-sm text-gray-500">
                Email us at{' '}
                <a href={`mailto:${constants.SALES_EMAIL}`}>
                  {constants.SALES_EMAIL}
                </a>{' '}
                if you are interested in committing to a monthly or longer
                contract. Save up to 30%.
              </p>
              {loginInfo?.loggedIn && (
                <Button
                  type="submit"
                  disabled={accountBalanceTooLow}
                  variant={accountBalanceTooLow ? 'secondary' : 'primary'}
                  className="mt-8"
                >
                  {accountBalanceTooLow
                    ? `Balance of $${info?.balance} too low`
                    : 'Deploy Server'}
                </Button>
              )}
              {loginInfo?.loggedIn === false && (
                <ButtonLink
                  to={constants.ROUTES.login}
                  className="mt-8 text-center"
                >
                  Log In to Deploy
                </ButtonLink>
              )}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">
              Pricing details will appear once you select a configuration.
            </p>
          )}
        </DashBlock>
      </form>
    </>
  );
}
