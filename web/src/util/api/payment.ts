import axios from '../axios';

/**
 * Fetches the _current user's_ payment methods.
 */
export async function fetchPaymentMethods() {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/paymentmethods`,
    { validateStatus: (status) => status < 500 }
  );
  const data = res.data as
    | { success: true; payment_methods: { last4: string; id: string }[] }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
  else return data.payment_methods;
}
