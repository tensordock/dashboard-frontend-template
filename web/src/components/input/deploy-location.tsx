import { AnimatePresence, m } from 'framer-motion';
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

      <div
        className={`grid mt-2 overflow-clip rounded-bigbtn bg-primary-500/10 ${
          Object.keys(locations).length > 1 ? 'xl:grid-cols-2' : ''
        } ${Object.keys(locations).length > 2 ? '2xl:grid-cols-3' : ''}`}
      >
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
                className={`inline-flex flex-col px-6 py-6 text-left transition-all font-display ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'hover:bg-primary-500/10'}`}
                ref={idx === 0 ? field.ref : undefined}
              >
                <div className="flex flex-row items-center gap-2">
                  <p>
                    <span className="i-tabler-map-pin mr-3 inline-block translate-y-[.125em]" />
                    {loc.location}
                  </p>
                  <p
                    className={`ml-auto min-w-max rounded-btn px-3 py-1 text-lg font-medium transition-all ${isSelected ? 'ring-1 ring-white-300' : 'bg-primary-500/10 text-primary-500 dark:text-primary-300'}`}
                  >
                    ${loc.price.toFixed(4)}/hr
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <p
                    className={`rounded-full px-4 py-1 ring-1 ring-primary-500/30 transition-all ${isSelected ? 'ring-white/30 dark:ring-primary-300' : 'text-primary-500 dark:text-primary-300 dark:ring-primary-300/40'}`}
                  >
                    <span className="i-tabler-clock mr-2 inline-block translate-y-[.125em]" />
                    {uptime}% uptime
                  </p>
                  <p
                    className={`rounded-full px-4 py-1 ring-1 transition-all ${isSelected ? 'ring-white/30 ring-primary-500/30 dark:ring-primary-300' : 'text-gray-500 dark:text-neutral-300 ring-gray-300 dark:ring-neutral-500'}`}
                  >
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
      {Object.keys(locations).length === 0 && (
        <div className="select-none rounded-bigbtn bg-primary-500/10 py-12 text-center font-display">
          All matching {constants.GPU_INFO[selectedGpuModel].shortName} servers
          are currently busy!
        </div>
      )}
      {/* TODO: suggested locations */}
      <AnimatePresence>
        {errorMessage && (
          <m.div
            className="overflow-auto"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <div className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errorMessage}.
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
