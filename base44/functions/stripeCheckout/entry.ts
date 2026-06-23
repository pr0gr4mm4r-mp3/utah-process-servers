import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.7.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { packageName, packagePrice, serviceType } = await req.json();
    if (!packageName || !packagePrice) {
      return Response.json({ error: 'packageName and packagePrice are required' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const origin = req.headers.get('Origin') || '';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: packageName },
          unit_amount: Math.round(parseFloat(packagePrice) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/submit?paid=1&method=stripe`,
      cancel_url: `${origin}/pricing`,
      metadata: { packageName, packagePrice, serviceType },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('stripeCheckout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});