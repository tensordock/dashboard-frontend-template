import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import PaymentMethodSelector from '../../components/input/payment-method';
import TextInput from '../../components/input/text-input';
import useAutomations from '../../hooks/use-automations';
import * as api from '../../util/api';

type AddAutomationFormValues = z.infer<typeof api.addAutomationSchema>;

export default function AddAutomationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { addAutomation } = useAutomations();

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<AddAutomationFormValues>({
    resolver: zodResolver(api.addAutomationSchema),
    defaultValues: {
      actionType: undefined,
      threshold: '$10.00',
      chargeAmount: '',
      chooseCard: undefined,
      emailTarget: '',
    },
  });

  const actionType = useWatch({ control, name: 'actionType' });

  const onSubmit: SubmitHandler<AddAutomationFormValues> = async (form) => {
    try {
      await addAutomation(form);
      toast.success('Successfully added automation!');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="threshold"
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
            disabled={isSubmitting}
            placeholder="$10.00"
            label="Amount"
            errorMessage={error?.message}
          />
        )}
      />
      <label className="inline-flex flex-col">
        <div className="mb-1 text-sm text-gray-500">Automation Type</div>
        <select
          className="cursor-pointer rounded bg-white px-3 py-2 ring-1 ring-gray-300 focus-visible:ring-blue-500"
          {...register('actionType')}
        >
          {[
            { value: undefined, text: 'Select...' },
            { value: 'email', text: 'Email Notification' },
            { value: 'charge', text: 'Add Funds' },
          ].map(({ value, text }) => (
            <option key={value ?? 'undefined'} value={value}>
              {text}
            </option>
          ))}
        </select>
      </label>
      {actionType === 'email' && (
        <>
          <TextInput
            type="email"
            {...register('emailTarget')}
            placeholder="johndoe@gmail.com"
            label="Email Recipient"
            // @ts-expect-error - funny discriminated union
            errorMessage={errors.emailTarget?.message}
          />
        </>
      )}
      {actionType === 'charge' && (
        <>
          <Controller
            name="chargeAmount"
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
                disabled={isSubmitting}
                placeholder="$10"
                label="Charge Amount"
                errorMessage={error?.message}
              />
            )}
          />
          <PaymentMethodSelector {...register('chooseCard')} />
        </>
      )}
      {actionType !== undefined && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded bg-primary-500 px-4 py-2 text-white font-display shadow transition-colors sm:self-end disabled:bg-primary-300 sm:px-12 hover:enabled:bg-primary-600"
        >
          {
            <div
              className={`mr-1 h-[1ch] inline-flex items-center text-xl ${isSubmitting ? 'i-tabler-loader-2 animate-spin' : 'i-tabler-automation'}`}
            />
          }
          Create Automation
        </button>
      )}
    </form>
  );
}
