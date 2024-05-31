import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { ROUTES } from '../../constants/pages';
import useAuth from '../../hooks/use-auth';
import toast from 'react-hot-toast';

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

    if (!stripe || !elements || !loginInfo) return;

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
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-primary-500 px-4 py-2 text-white font-display shadow transition-colors sm:self-end disabled:bg-primary-300 sm:px-12 hover:enabled:bg-primary-600"
      >
        Complete Deposit
      </button>
    </form>
  );
}
