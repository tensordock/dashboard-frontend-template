import { AnimatePresence, m } from 'framer-motion';
import { RefCallBack } from 'react-hook-form';

import * as constants from '../../constants';

export default function OperatingSystemSelectInput({
  field: { onChange, value, disabled, ref },
  errorMessage,
}: {
  field: {
    onChange: (v: string) => void;
    value: string;
    disabled?: boolean;
    ref: RefCallBack;
  };
  errorMessage?: string;
}) {
  return (
    <>
      <div className="grid overflow-clip rounded-bigbtn md:grid-cols-2">
        {constants.ALLOWED_OS.map((os, idx) => {
          const isSelected = value === os;

          const { features, forAI, minStorageGB } = constants.OS_INFO[os];

          return (
            <button
              key={os}
              type="button"
              onClick={() => onChange(os)}
              disabled={disabled}
              className={`px-6 py-4 text-left flex flex-col transition border-primary-500/30 ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-primary-500/10 hover:bg-primary-500/20'}`}
              ref={idx === 0 ? ref : undefined}
            >
              <h4 className="flex items-center font-display">{os}</h4>
              {forAI && (
                <div
                  className={`mt-2 w-max rounded-btn px-4 py-1 font-display transition-colors text-sm ${isSelected ? 'ring-1 ring-white/30' : 'bg-primary-500/20 text-primary-500 dark:text-primary-300'}`}
                >
                  ML / AI
                </div>
              )}
              <AnimatePresence>
                {isSelected && (
                  <m.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm">
                      <span className="i-tabler-check mr-2 inline-block translate-y-1 text-lg" />
                      {features}
                    </p>
                    <p className="mt-2 text-sm">
                      {minStorageGB}GB storage required
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
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
