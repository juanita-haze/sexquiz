import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const PRICE_AMOUNT = 999; // $9.99 in cents
export const CURRENCY = 'usd';

export async function createCheckoutSession(quizId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: 'Unlock All Quiz Results',
            description: 'See all your compatibility matches with your partner',
          },
          unit_amount: PRICE_AMOUNT,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/results/${quizId}?success=true`,
    cancel_url: `${baseUrl}/results/${quizId}?canceled=true`,
    metadata: {
      quizId,
    },
  });

  return session.url!;
}
