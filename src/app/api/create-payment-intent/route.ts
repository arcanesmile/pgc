// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2025-05-28.basil';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  return new Stripe(key, { apiVersion: STRIPE_API_VERSION });
};

export async function POST() {
  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00 in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : 'Failed to create payment intent';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
