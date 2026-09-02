Deno.serve(async (req) => {
  try {
    return Response.json({
      paypalClientId: Deno.env.get('PAYPAL_CLIENT_ID') || '',
      zelleEmail: Deno.env.get('ZELLE_EMAIL') || '',
      venmoHandle: Deno.env.get('VENMO_HANDLE') || '',
    });
  } catch (error) {
    console.error('getPaymentConfig error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});