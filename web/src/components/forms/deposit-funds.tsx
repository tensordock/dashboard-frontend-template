import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddressElement,
  Elements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import axios from '../../util/axios';
import getStripe from '../../util/stripe';
import TextInput from '../input/text-input';

const depositFormSchema = z.object({
  amount: z
    .string()
    .transform((val) => parseFloat(val.replace(/[^0-9.-]/g, '')))
    .refine((val) => !isNaN(val), 'Amount must be a number')
    .transform((val) => val || 0)
    .refine((val) => val >= 5, 'Must deposit at least $5')
    .transform((val) => val.toFixed(2)),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export default function DepositFundsForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: '',
    },
  });

  const [stripeInfo, setStripeInfo] = useState<{
    stripe: Stripe;
    clientSecret: string;
  } | null>(null);

  const onSubmit: SubmitHandler<DepositFormValues> = async ({ amount }) => {
    console.log(parseFloat(amount));
    const [stripeSettled, clientSecretSettled] = await Promise.allSettled([
      getStripe(),
      (async () => {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/deposit`,
          JSON.stringify({ amount: parseFloat(amount) }),
          {
            validateStatus: (status) => status < 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        return res.data as
          | { success: true; client_secret: string }
          | { success: false; error: string };
      })(),
    ]);
    if (
      stripeSettled.status === 'rejected' ||
      clientSecretSettled.status === 'rejected'
    ) {
      toast.error('An unexpected error occurred.');
      return;
    }
    if (clientSecretSettled.value.success === false) {
      toast.error(clientSecretSettled.value.error);
      return;
    }
    setStripeInfo({
      stripe: stripeSettled.value,
      clientSecret: clientSecretSettled.value.client_secret,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-grow flex-col">
          <Controller
            name="amount"
            control={control}
            render={({
              field: { ref, value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <TextInput
                type="text"
                value={value}
                onChange={onChange}
                onBlur={(evt) => {
                  onChange(
                    `$${parseFloat(
                      evt.target.value.trim().replace(/[^0-9.-]/g, '') || '0'
                    ).toFixed(2)}`
                  );
                  onBlur();
                }}
                ref={ref}
                disabled={stripeInfo !== null || isSubmitting}
                placeholder="$5.00"
                label="Amount"
                errorMessage={error?.message}
              />
            )}
          />
        </div>
        <button
          type="submit"
          disabled={stripeInfo !== null || isSubmitting}
          className="rounded bg-primary-500 px-4 py-2 text-white font-display shadow transition-colors sm:self-end disabled:bg-primary-300 sm:px-12 hover:enabled:bg-primary-600"
        >
          Confirm
        </button>
      </form>
      {stripeInfo !== null && (
        <Elements
          stripe={stripeInfo.stripe}
          options={{
            clientSecret: stripeInfo.clientSecret,
          }}
        >
          <form className="mt-8 flex flex-col gap-6">
            <PaymentElement />
            <AddressElement options={{ mode: 'billing' }} />
            <button
              type="submit"
              className="rounded bg-primary-500 px-4 py-2 text-white font-display shadow transition-colors sm:self-end hover:bg-primary-600 sm:px-12"
            >
              Complete Deposit
            </button>
          </form>
        </Elements>
      )}
    </>
  );
}
