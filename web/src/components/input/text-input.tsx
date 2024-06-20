import { AnimatePresence, m } from 'framer-motion';
import { HTMLProps, forwardRef } from 'react';

export default forwardRef<
  HTMLInputElement,
  Omit<HTMLProps<HTMLInputElement>, 'className' | 'ref'> & {
    type?: 'text' | 'email' | 'number' | 'password' | 'search';
    label?: string;
    errorMessage?: string;
  }
>(function TextInput({ type = 'text', label, errorMessage, ...props }, ref) {
  return (
    <label className="inline-flex flex-col">
      {label && (
        <div className="mb-1 select-none text-sm text-gray-500">{label}</div>
      )}
      <input
        type={type}
        {...props}
        ref={ref}
        className={`rounded-input px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500 ${errorMessage ? `ring-red-500 ring-2` : 'ring-gray-300 ring-1'}`}
      />
      <AnimatePresence>
        {errorMessage && (
          <m.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <div className="select-none pt-1 text-sm text-red-500">
              {errorMessage}.
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </label>
  );
});
