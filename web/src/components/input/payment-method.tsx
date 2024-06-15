import { HTMLProps, forwardRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import { ROUTES } from '../../constants/pages';
import { fetchPaymentMethods } from '../../util/api/payment';

export default forwardRef<
  HTMLSelectElement,
  Omit<HTMLProps<HTMLSelectElement>, 'ref'>
>(function PaymentMethodSelector(props, ref) {
  const { data: paymentMethods } = useSWR(
    '/api/v0/client/whitelabel/paymentmethods',
    fetchPaymentMethods
  );

  const options = useMemo(
    () => [
      { text: 'Select...', value: undefined },
      ...(paymentMethods?.map(({ last4, id }) => ({
        text: `**** **** **** ${last4}`,
        value: id,
      })) ?? []),
    ],
    [paymentMethods]
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
      {paymentMethods && paymentMethods?.length === 0 && (
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
