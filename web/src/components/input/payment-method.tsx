import { HTMLProps, forwardRef, useMemo } from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants/pages';
import fetcher from '../../util/fetcher';

export default forwardRef<
  HTMLSelectElement,
  Omit<HTMLProps<HTMLSelectElement>, 'ref'>
>(function PaymentMethodSelector(props, ref) {
  const { data } = useSWR(
    '/api/v0/client/whitelabel/paymentmethods',
    fetcher<{ payment_methods: { last4: string; id: string }[] }>
  );

  const options = useMemo(
    () => [
      { text: 'Select...', value: undefined },
      ...(data?.payment_methods.map(({ last4, id }) => ({
        text: `**** **** **** ${last4}`,
        value: id,
      })) ?? []),
    ],
    [data]
  );

  return (
    <label className="inline-flex flex-col">
      <div className="mb-1 text-sm text-gray-500">Payment Method</div>
      <select
        {...props}
        ref={ref}
        className="cursor-pointer rounded bg-white px-3 py-2 ring-1 ring-gray-300 focus-visible:ring-blue-500"
      >
        {options.map(({ text, value }) => (
          <option key={value ?? 'undefined'} value={value}>
            {text}
          </option>
        ))}
      </select>
      {data && data.payment_methods.length === 0 && (
        <div className="mt-2 max-w-prose font-display">
          Please{' '}
          <Link to={ROUTES.accountDeposit} className="font-semibold underline">
            make a deposit
          </Link>{' '}
          first to register a payment method with your email!
        </div>
      )}
    </label>
  );
});
