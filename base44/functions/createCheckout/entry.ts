Deno.serve(async (req) => {
  try {
    const { packageName, packagePrice } = await req.json();

    if (!packageName || !packagePrice) {
      return Response.json({ error: "Package name and price are required" }, { status: 400 });
    }

    const WIX_API_KEY = Deno.env.get("WIX_PAYMENTS_API_KEY");
    const WIX_SITE_ID = Deno.env.get("WIX_PAYMENTS_SITE_ID");
    const origin = req.headers.get("Origin") || "";

    const response = await fetch(
      "https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": WIX_API_KEY,
          "wix-site-id": WIX_SITE_ID,
        },
        body: JSON.stringify({
          cart: {
            items: [{
              name: packageName,
              quantity: 1,
              price: packagePrice,
            }],
          },
          callbackUrls: {
            postFlowUrl: origin || "https://example.com",
            thankYouPageUrl: `${origin}/thank-you`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Wix checkout API error:", JSON.stringify(data));
      return Response.json({ error: data.message || "Failed to create checkout" }, { status: response.status });
    }

    return Response.json({
      redirectUrl: data.checkoutSession.redirectUrl,
      sessionId: data.checkoutSession.id,
    });
  } catch (error) {
    console.error("create-checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});