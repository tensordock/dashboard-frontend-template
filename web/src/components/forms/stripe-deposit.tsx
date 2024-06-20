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
    <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: 'billing' }} />
      <Button type="submit" disabled={isSubmitting} className="self-end">
        Complete Deposit
      </Button>
    </form>
  );
}
