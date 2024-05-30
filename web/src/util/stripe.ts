import { Stripe, loadStripe } from '@stripe/stripe-js';

async function* stripeGenerator() {
  const stripe = await loadStripe(
    'pk_live_51JqNQYHSshR0IOtvfpFJ335VCKxHeyzKzGT8XaWMNvt5ye74VXApsofamVwZN3Ec2H9Y9Ap5WsVlVwxgnEL1Ys7R00rbTg3ky9'
  );
  while (true) {
    yield stripe;
  }
}

const stripe = stripeGenerator();

export default async function getStripe() {
  return (await stripe.next()).value as Stripe;
}
