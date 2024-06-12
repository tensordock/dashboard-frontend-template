import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { DEFAULT_PORTS } from '../constants/datacenter';
import useVirtualMachines from '../hooks/use-virtual-machines';
import { VirtualMachineEntry } from '../util/api';

export default function VirtualMachinePanel({
  vm,
}: {
  vm: VirtualMachineEntry & { id: string };
}) {
  const [disableButtons, setDisableButtons] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const onButtonClick = useCallback(
    async (callback: () => Promise<unknown>, loadingText: string) => {
      const toastId = toast.loading(loadingText);
      setDisableButtons(true);

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
        setDisableButtons(false);
      }
    },
    []
  );

  const { startVM, stopVM, deleteVM } = useVirtualMachines();

  return (
    <li className="rounded-xl bg-gray-50 ring-1 ring-gray-200">
      <h3 className="block rounded-t-xl bg-primary-500 px-8 py-4 text-xl text-white font-display">
        {vm.name}
      </h3>
      <div className="flex flex-col gap-6 px-8 py-4 lg:flex-row">
        <div>
          <div className="text-sm text-gray-500">
            <p>
              <div className="i-tabler-map-pin mr-2 inline-block translate-y-[0.12em]" />
              {vm.city}, {vm.state}, {vm.country}
            </p>
            <p className="mt-1">
              <div className="i-tabler-cloud-computing mr-2 inline-block translate-y-[0.12em]" />
              {vm.specs.gpu.type} ({vm.specs.gpu.amount})
            </p>
            <div className="mt-1 flex flex-wrap gap-4">
              <p>
                <div className="i-tabler-cpu mr-1 inline-block translate-y-[0.12em]" />
                {vm.specs.vcpus} vCPUs
              </p>
              <p>
                <div className="i-tabler-stack-2 mr-1 inline-block translate-y-[0.12em]" />
                {vm.specs.ram} GB RAM
              </p>
              <p>
                <div className="i-tabler-database mr-1 inline-block translate-y-[0.12em]" />
                {vm.specs.storage} GB Storage
              </p>
            </div>
            <button onClick={() => setDetailsOpen((o) => !o)} className="mt-4">
              <div
                className={`i-tabler-chevron-down inline-block translate-y-[.15em] mr-2 transition-transform ${detailsOpen ? '' : '-rotate-90'}`}
              />
              Details
            </button>
            <AnimatePresence>
              {detailsOpen && (
                <motion.div
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

                    <p className="select-none text-gray-700 font-medium">
                      Currently
                    </p>
                    <p className="text-gray-700 font-medium tabular-nums">
                      $
                      {(vm.status === 'Running'
                        ? parseFloat(vm.total_price)
                        : parseFloat(vm.storage_price)
                      ).toFixed(4)}
                      /hour
                    </p>
                  </div>

                  <div className="grid grid-cols-2 mt-2 gap-x-4 gap-y-1">
                    <p className="select-none">OS</p>
                    <p>{vm.operating_system}</p>

                    <p className="select-none">IP Address</p>
                    <p>{vm.ip_address}</p>

                    <p className="select-none">Dedicated IP</p>
                    <p>{vm.dedicated_ip_address || 'N/A'}</p>

                    <p className="select-none">Port Forwards</p>
                    <div>
                      {[
                        ...DEFAULT_PORTS.map(({ from, to }) => [from, to]),
                        ...Object.entries(vm.port_forwards),
                      ].map(([from, to]) => (
                        <p key={`${from}..${to}`}>
                          {from}{' '}
                          <div className="i-tabler-arrow-right mr-1 inline-block translate-y-[0.12em]" />{' '}
                          {to}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col lg:ml-auto lg:items-end lg:text-end">
          <div className="mb-4 flex items-center font-display">
            <p>
              <span className="i-tabler-activity-heartbeat mr-2 inline-block translate-y-0.5 animate-pulse" />
              {vm.status}
            </p>
            <button
              type="button"
              onClick={() =>
                onButtonClick(() => deleteVM(vm.id), 'Deleting machine...')
              }
              disabled={disableButtons}
              className="ml-auto rounded bg-red-500/0 px-4 py-1 text-sm text-red-500 font-display shadow ring-1 ring-red-500 transition-colors lg:ml-6 disabled:text-red-300 disabled:ring-red-300 hover:enabled:bg-red-500/100 hover:enabled:text-white"
            >
              <span className="i-tabler-trash mr-2 inline-block translate-y-0.5" />
              Delete
            </button>
          </div>
          {vm.status === 'Running' ? (
            <div className="flex flex-col gap-[1px]">
              <button
                type="button"
                onClick={() =>
                  onButtonClick(
                    () => stopVM(vm.id, true),
                    'Stopping machine...'
                  )
                }
                disabled={disableButtons}
                className="rounded-t bg-orange-500/0 px-6 py-1 text-sm text-orange-500 font-display ring-1 ring-orange-500 transition-colors disabled:text-orange-300 disabled:ring-orange-300 hover:enabled:bg-orange-500/100 hover:enabled:text-white"
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
                className="rounded-b bg-orange-500/0 px-6 py-1 text-sm text-orange-500 font-display ring-1 ring-orange-500 transition-colors disabled:text-orange-300 disabled:ring-orange-300 hover:enabled:bg-orange-500/100 hover:enabled:text-white"
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
    </li>
  );
}
