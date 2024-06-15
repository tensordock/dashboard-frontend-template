import { AnimatePresence, motion } from 'framer-motion';
import { RefCallBack } from 'react-hook-form';

import * as constants from '../../constants';
import { LocationInfo } from '../../util/api';

export default function DeployLocationInput({
  field,
  errorMessage,
  locations,
  selectedGpuModel,
}: {
  field: {
    onChange: (v: string) => void;
    value: string;
    disabled?: boolean;
    ref: RefCallBack;
  };
  errorMessage?: string;
  locations: Record<string, LocationInfo>;
  suggestedLocations: Record<string, LocationInfo>;
  selectedGpuModel: constants.GpuModel;
}) {
  return (
    <>
      <h4 className="mt-4 select-none text-lg font-display">
        Available {constants.GPU_INFO[selectedGpuModel].displayName} servers
      </h4>

      {locations && (
        <div className="grid mt-2 overflow-clip rounded-lg bg-primary-500/10 lg:grid-cols-2">
          {Object.keys(locations).length > 0 &&
            Object.entries(locations).map(([id, loc], idx) => {
              const isSelected = !!loc.hostnodes.find(
                ({ id }) => id === field.value
              );

              const reservedHostnode = loc.hostnodes.find(
                (hostnode) => hostnode.reserved
              );
              const defaultHostnode = reservedHostnode || loc.hostnodes[0];

              const uptime = (defaultHostnode.uptime * 100).toFixed(2);
              // const lowUptime = Number(uptime) < 99.5;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    field.onChange(defaultHostnode.id);
                  }}
                  className={`inline-flex flex-col px-6 py-6 text-left transition-colors font-display ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'hover:bg-primary-500/10'}`}
                  ref={idx === 0 ? field.ref : undefined}
                >
                  <div className="flex flex-row items-center gap-2">
                    <p>
                      <span className="i-tabler-map-pin mr-2 inline-block translate-y-[.125em]" />
                      {loc.location}
                    </p>
                    <p
                      className={`ml-auto min-w-max rounded px-3 py-1 text-lg font-medium transition-colors ${isSelected ? 'ring-1 ring-white-300' : 'bg-primary-500/10 text-primary-500'}`}
                    >
                      ${loc.price}/hr
                    </p>
                  </div>
                  <div
                    className={`grid mt-4 max-w-2xl gap-1.5 leading-tight text-sm transition-colors font-sans ${isSelected ? 'text-white' : 'text-gray-500'}`}
                  >
                    <p>
                      <span className="i-tabler-cpu mr-2 inline-block translate-y-[.125em]" />
                      {defaultHostnode.specs.cpu.amount}x {loc.cpuType} vCPUs
                    </p>
                    <div className="flex gap-4">
                      <p>
                        <span className="i-tabler-server mr-2 inline-block translate-y-[.125em]" />
                        {defaultHostnode.specs.gpu[loc.gpuType].amount}x{' '}
                        {constants.GPU_INFO[loc.gpuType].shortName}
                      </p>
                      <p>
                        <span className="i-tabler-stack-2 mr-2 inline-block translate-y-[.125em]" />
                        {defaultHostnode.specs.ram.amount} GB RAM
                      </p>
                    </div>
                    <p>
                      <span className="i-tabler-database mr-2 inline-block translate-y-[.125em]" />
                      {defaultHostnode.specs.storage.amount}GB NVMe SSD
                    </p>

                    <p>
                      <span
                        className={`mr-2 inline-block translate-y-[.125em] ${
                          {
                            'Low Stock': 'i-tabler-alert-circle',
                            'Medium Stock': 'i-tabler-graph',
                            'High Stock': 'i-tabler-circle-check',
                          }[loc.availability]
                        }`}
                      />
                      {loc.availability}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2 text-sm">
                    <p
                      className={`rounded-full px-4 py-1 ring-1 ring-primary-500/30 ${isSelected ? 'ring-white/30' : 'text-primary-500'}`}
                    >
                      <span className="i-tabler-clock mr-2 inline-block translate-y-[.125em]" />
                      {uptime}% uptime
                    </p>
                    {reservedHostnode && (
                      <p
                        className={`rounded-full px-4 py-1 ring-1 ring-primary-500/30 ${isSelected ? 'ring-white/30' : 'text-primary-500'}`}
                      >
                        Reserved for you
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      )}
      {locations && Object.keys(locations).length === 0 && (
        <div className="select-none rounded-lg bg-primary-500/10 py-12 text-center font-display">
          All matching {constants.GPU_INFO[selectedGpuModel].shortName} servers
          are currently busy!
        </div>
      )}
      {/* TODO: suggested locations */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="overflow-auto"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <div className="mt-1 text-sm text-red-500">{errorMessage}.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
