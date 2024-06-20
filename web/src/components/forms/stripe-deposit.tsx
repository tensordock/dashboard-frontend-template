import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { ROUTES } from '../../constants/pages';
import useAuth from '../../hooks/use-auth';
import Button from '../common/button';

export default function StripeDepositForm({
  onSuccess,
}: {
  onSuccess?: () => void | Promise<void>;
}) {
  const { loginInfo } = useAuth();

  const elements = useElements();
  const stripe = useStripe();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    setIsSubmitting(true);

    if (!stripe || !elements || !loginInfo?.loggedIn) return;

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${ROUTES.account}`,
        receipt_email: loginInfo.email,
      },
      redirect: 'if_required',
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error.message ?? 'An unknown error occurred.');
    } else {
      toast.success('Deposit successful!');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form className="mt-8 flex flex-col" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 rounded-card bg-white px-6 pb-6 pt-2">
        <PaymentElement />
        <AddressElement options={{ mode: 'billing' }} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-4 self-end">
        Complete Deposit
      </Button>
    </form>
  );
}
