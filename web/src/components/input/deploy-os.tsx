import { AnimatePresence, motion } from 'framer-motion';
import { OPERATING_SYSTEMS, OS_DETAILS } from '../../constants/datacenter';

export default function OperatingSystemSelectInput({
  field: { onChange, value, disabled },
  errorMessage,
}: {
  field: { onChange: (v: string) => void; value: string; disabled?: boolean };
  errorMessage?: string;
}) {
  return (
    <>
      <div className="flex flex-col">
        {OPERATING_SYSTEMS.map((os) => {
          const isSelected = value === os;
          const { features, forAI } = OS_DETAILS[os];
          return (
            <button
              key={os}
              type="button"
              onClick={() => onChange(os)}
              disabled={disabled}
              className={`px-6 py-4 text-left flex flex-col transition border-primary-500/30 first:rounded-t-lg last:rounded-b-lg ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-primary-500/10 hover:bg-primary-500/20'}`}
            >
              <h4 className="flex items-center font-display">
                {os}
                {forAI && (
                  <span
                    className={`rounded px-4 py-1 font-display transition-colors ml-auto inline-block text-sm ${isSelected ? 'ring-1 ring-white/30' : 'bg-primary-500/20 text-primary-500'}`}
                  >
                    ML / AI
                  </span>
                )}
              </h4>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm">
                      <span className="i-tabler-check mr-2 inline-block translate-y-1 text-lg" />
                      {features}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
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
