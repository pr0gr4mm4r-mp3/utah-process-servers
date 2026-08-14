Deno.serve(async (req) => {
  try {
    return Response.json({
      stripePublishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY') || '',
      paypalClientId: Deno.env.get('PAYPAL_CLIENT_ID') || '',
      zelleEmail: Deno.env.get('ZELLE_EMAIL') || '',
      venmoHandle: Deno.env.get('VENMO_HANDLE') || '',
      wixPaymentsEnabled: !!(Deno.env.get('WIX_PAYMENTS_API_KEY') && Deno.env.get('WIX_PAYMENTS_SITE_ID')),
    });
  } catch (error) {
    console.error('getPaymentConfig error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});