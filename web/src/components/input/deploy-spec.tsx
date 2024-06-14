import { AnimatePresence, motion } from 'framer-motion';
import { HTMLProps, forwardRef } from 'react';
import { DashBlock } from '../dash-block';

export default forwardRef<
  HTMLSelectElement,
  Omit<HTMLProps<HTMLSelectElement>, 'className' | 'ref'> & {
    options: number[];
    label?: string;
    errorMessage?: string;
    transformValues?: (v: number) => string;
  }
>(function DeploySpecInput(
  { options, label, errorMessage, transformValues = (v) => v, ...props },
  ref
) {
  return (
    <DashBlock>
      <label className="flex flex-col">
        {label && (
          <div className="mb-4 select-none text-xl font-display -mt-3">
            {label}
          </div>
        )}
        <select
          {...props}
          ref={ref}
          className={`rounded px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500 bg-transparent ${errorMessage ? `ring-red-500 ring-2` : 'ring-gray-300 ring-1'}`}
        >
          {options.map((value) => (
            <option key={value} value={value}>
              {transformValues(value)}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
            >
              <div className="select-none pt-1 text-sm text-red-500">
                {errorMessage}.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>
    </DashBlock>
  );
});
