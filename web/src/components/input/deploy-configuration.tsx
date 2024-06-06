import { AnimatePresence, motion } from 'framer-motion';

import { DeployConfiguration } from '../../constants/datacenter';

export default function ConfigurationSelectInput({
  field: { onChange, value, disabled },
  configurations,
  errorMessage,
}: {
  field: { onChange: (v: string) => void; value: string; disabled?: boolean };
  configurations: DeployConfiguration[];
  errorMessage?: string;
}) {
  return (
    <>
      <motion.ul
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.25 } },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {configurations.map((config) => {
          const stringified = JSON.stringify(config);
          const isSelected = stringified === value;
          return (
            <motion.li
              variants={{
                hidden: { opacity: 0, height: 0 },
                show: {
                  opacity: 1,
                  height: 'auto',
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
              }}
              key={JSON.stringify(config)}
              className="inline-flex flex-col overflow-hidden"
            >
              <button
                type="button"
                onClick={() => onChange(stringified)}
                disabled={disabled}
                className={`rounded-lg px-6 py-8 text-left flex flex-col transition ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-primary-500/10 hover:bg-primary-500/20'}`}
              >
                <div>
                  <h4 className="text-xl font-medium font-display">
                    {config.gpu_count}x {config.gpu_model}
                  </h4>
                  <div
                    className={`mt-3 text-sm ${isSelected ? '' : 'text-gray-500'}`}
                  >
                    <p className="inline-flex items-center gap-2">
                      <span className="i-tabler-cpu" />
                      {config.vcpu} vCPUs, Intel Xeon Platinum 8470 @ 3.8 GHz
                      boost
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <p className="inline-flex items-center gap-2">
                        <span className="i-tabler-stack-2" />
                        {config.ram} GB DDR5
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <span className="i-tabler-database" />
                        {config.storage} GB NVMe SSD
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <span className="i-tabler-bolt" />
                        {config.bandwidth} Gbps
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <span className="i-tabler-map-pin" />
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
            </motion.li>
          );
        })}
      </motion.ul>
      <AnimatePresence>
        {errorMessage && (
          <motion.div className="mt-1 text-sm text-red-500">
            {errorMessage}.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
