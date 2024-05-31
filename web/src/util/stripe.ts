import { Stripe, loadStripe } from '@stripe/stripe-js';

async function* stripeGenerator() {
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  while (true) {
    yield stripe;
  }
}

const stripe = stripeGenerator();

export default async function getStripe() {
  return (await stripe.next()).value as Stripe;
}
