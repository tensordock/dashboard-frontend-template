import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import useVirtualMachines from '../hooks/use-virtual-machines';
import { VirtualMachineEntry } from '../util/api';
import { GPU_INFO, GpuModel } from '../constants';

const VM_STATUS_INFO = new Map([
  ['Running', { class: 'text-green-700 dark:text-green-300', text: 'Running' }],
  [
    'Stopped',
    {
      class: 'text-red-700 dark:text-red-300',
      text: 'Stopped with resources reserved',
    },
  ],
  [
    'StoppedDisassociated',
    {
      class: 'text-red-700 dark:text-red-300',
      text: 'Stopped with resources disassociated ',
    },
  ],
]);

export default function VirtualMachinePanel({
  vm,
}: {
  vm: VirtualMachineEntry & { id: string };
}) {
  const [mutating, setMutating] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const onButtonClick = useCallback(
    async (callback: () => Promise<unknown>, loadingText: string) => {
      const toastId = toast.loading(loadingText);
      setMutating(true);

      try {
        await callback();
        toast.success('Success!', { id: toastId });
      } catch (err) {
        toast.error(
          err instanceof Error
            ? `${err.message}.`
            : 'An unknown error occurred.',
          { id: toastId }
        );
      } finally {
        setMutating(false);
      }
    },
    []
  );

  const { startVM, stopVM, deleteVM } = useVirtualMachines();

  const disableButtons = mutating;

  const statusInfo = VM_STATUS_INFO.get(vm.status) || {
    class: '',
    text: vm.status,
  };

  const sshPort = vm.dedicated_ip_address
    ? undefined
    : Object.entries(vm.port_forwards).find(([, to]) => to === '22')?.[0];
  const connectCommand = `ssh${sshPort ? ` -p ${sshPort}` : ''} user@${vm.dedicated_ip_address ?? vm.ip_address}`;

  return (
    <li className="rounded-card bg-white shadow-lg dark:bg-neutral-700 dark:ring-2 dark:ring-neutral-600">
      <h3 className="block rounded-t-card bg-primary-500 px-8 py-4 text-xl text-white font-display">
        {vm.name}
      </h3>
      <div className="my-4 flex flex-col gap-6 px-8 lg:flex-row">
        <div className="text-sm text-gray-500 dark:text-neutral-400">
          <p>
            <span className="i-tabler-map-pin mr-2 inline-block translate-y-[0.12em]" />
            {vm.city}, {vm.state}, {vm.country}
          </p>
          <p className="mt-1">
            <span className="i-tabler-cloud-computing mr-2 inline-block translate-y-[0.12em]" />
            {GPU_INFO[vm.specs.gpu.type as GpuModel].displayName}
            {vm.specs.gpu.amount > 1 && ` x${vm.specs.gpu.amount}`}
          </p>
          <div className="mt-1 flex flex-wrap gap-4">
            <p>
              <span className="i-tabler-cpu mr-1 inline-block translate-y-[0.12em]" />
              {vm.specs.vcpus} vCPUs
            </p>
            <p>
              <span className="i-tabler-stack-2 mr-1 inline-block translate-y-[0.12em]" />
              {vm.specs.ram} GB RAM
            </p>
            <p>
              <span className="i-tabler-database mr-1 inline-block translate-y-[0.12em]" />
              {vm.specs.storage} GB Storage
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:ml-auto lg:items-end lg:text-end">
          <div className={'mb-4 flex items-center font-display'}>
            <p className={`rounded ${statusInfo.class} inline-block`}>
              <span className="i-tabler-activity-heartbeat mr-2 inline-block translate-y-0.5 animate-pulse" />
              {statusInfo.text}
            </p>
            <button
              type="button"
              onClick={() => {
                if (!window.confirm('Are you sure you want to delete this VM?'))
                  return;
                return onButtonClick(
                  () => deleteVM(vm.id),
                  'Deleting machine...'
                );
              }}
              disabled={disableButtons}
              className="ml-auto min-w-max rounded-btn bg-red-500/0 px-4 py-1 text-sm text-red-500 font-display shadow ring-2 ring-red-500 transition-colors lg:ml-6 dark:text-red-400 disabled:opacity-60 dark:ring-red-400 disabled:ring-red-300 hover:enabled:bg-red-500/100 hover:enabled:text-white dark:hover:enabled:bg-red-400 dark:hover:enabled:text-black"
            >
              <span className="i-tabler-trash mr-2 inline-block translate-y-0.5" />
              Delete
            </button>
          </div>
          {vm.status === 'Running' ? (
            <div className="flex flex-col gap-[2px]">
              <button
                type="button"
                onClick={() =>
                  onButtonClick(
                    () => stopVM(vm.id, true),
                    'Stopping machine...'
                  )
                }
                disabled={disableButtons}
                className="rounded-t-btn bg-orange-500/0 px-6 py-1 text-sm text-orange-500 font-display ring-2 ring-orange-500 transition-colors dark:text-orange-300 disabled:opacity-60 dark:ring-orange-300 disabled:ring-orange-300 hover:enabled:bg-orange-500/100 hover:enabled:text-white dark:hover:enabled:bg-orange-300 dark:hover:enabled:text-black"
              >
                <span className="i-tabler-square mr-2 inline-block translate-y-0.5" />
                Stop and release GPU
              </button>
              <button
                type="button"
                onClick={() =>
                  onButtonClick(
                    () => stopVM(vm.id, false),
                    'Stopping machine...'
                  )
                }
                disabled={disableButtons}
                className="rounded-b-btn bg-orange-500/0 px-6 py-1 text-sm text-orange-500 font-display ring-2 ring-orange-500 transition-colors dark:text-orange-300 disabled:opacity-60 dark:ring-orange-300 disabled:ring-orange-300 hover:enabled:bg-orange-500/100 hover:enabled:text-white dark:hover:enabled:bg-orange-300 dark:hover:enabled:text-black"
              >
                <span className="i-tabler-square mr-2 inline-block translate-y-0.5" />
                Stop and reserve GPU
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  onButtonClick(() => startVM(vm.id), 'Starting machine...')
                }
                className="rounded bg-primary-500 px-4 py-2 text-white font-display shadow transition-colors sm:self-end disabled:bg-primary-300 sm:px-12 hover:enabled:bg-primary-600"
                disabled={disableButtons}
              >
                <span className="i-tabler-player-play mr-2 inline-block translate-y-0.5" />
                Start VM
              </button>
            </>
          )}
        </div>
      </div>
      <div className="my-4 px-8 text-sm text-gray-500 dark:text-neutral-400">
        <button onClick={() => setDetailsOpen((o) => !o)}>
          <span
            className={`i-tabler-chevron-down inline-block translate-y-[.15em] mr-2 transition-transform ${detailsOpen ? '' : '-rotate-90'}`}
          />
          Details
        </button>
        <AnimatePresence>
          {detailsOpen && (
            <m.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 mt-2 gap-x-4 gap-y-1">
                <p className="select-none">Compute cost</p>
                <p className="tabular-nums">
                  ${parseFloat(vm.compute_price).toFixed(4)}/hour
                </p>

                <p className="select-none">Storage cost</p>
                <p className="tabular-nums">
                  ${parseFloat(vm.storage_price).toFixed(4)}/hour
                </p>

                <p className="select-none">When running</p>
                <p className="tabular-nums">
                  ${parseFloat(vm.total_price).toFixed(4)}/hour
                </p>

                <p className="select-none text-gray-700 font-medium dark:text-neutral-300">
                  Currently
                </p>
                <p className="text-gray-700 font-medium tabular-nums dark:text-neutral-300">
                  $
                  {(vm.status === 'Running' || vm.status === 'Stopped'
                    ? parseFloat(vm.total_price)
                    : parseFloat(vm.storage_price)
                  ).toFixed(4)}
                  /hour
                </p>
              </div>

              <div className="grid grid-cols-2 mt-4 gap-x-4 gap-y-1">
                <p className="select-none">Machine ID</p>
                <p className="font-mono">{vm.id}</p>

                <p className="select-none">Hostnode ID</p>
                <p className="font-mono">{vm.hostnode}</p>

                <p className="select-none">Operating System</p>
                <p>{vm.operating_system}</p>

                {vm.dedicated_ip_address && (
                  <>
                    <p className="select-none">Dedicated IP</p>
                    <p className="font-mono">{vm.dedicated_ip_address}</p>
                  </>
                )}
                {!vm.dedicated_ip_address && (
                  <>
                    <p className="select-none">IP Address</p>
                    <p className="font-mono">{vm.ip_address}</p>

                    <p className="select-none">Port Forwards</p>
                    <div>
                      {Object.entries(vm.port_forwards).map(([from, to]) => (
                        <p key={`${from}..${to}`} className="font-mono">
                          {from}{' '}
                          <span className="i-tabler-arrow-right mr-1 inline-block translate-y-[0.12em]" />{' '}
                          {to}
                        </p>
                      ))}
                    </div>
                  </>
                )}
                <p className="select-none">Connection Instructions</p>
                <div>
                  <pre>{connectCommand}</pre> and log in with the password you
                  set
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}
