Deno.serve(async (req) => {
  try {
    const { packageName, packagePrice } = await req.json();

    if (!packageName || !packagePrice) {
      return Response.json({ error: "Package name and price are required" }, { status: 400 });
    }

    const WIX_API_KEY = Deno.env.get("WIX_PAYMENTS_API_KEY");
    const WIX_SITE_ID = Deno.env.get("WIX_PAYMENTS_SITE_ID");

    if (!WIX_API_KEY || !WIX_SITE_ID) {
      console.error("createCheckout: Missing WIX_PAYMENTS_API_KEY or WIX_PAYMENTS_SITE_ID");
      return Response.json({ error: "Payment processing not configured" }, { status: 500 });
    }

    // Build app URL from X-Base44-App-Url header (preferred), falling back to Origin.
    // Never trust Origin alone in production — it's caller-controlled and wrong in PWAs/preview.
    const appUrl = req.headers.get("X-Base44-App-Url") || req.headers.get("Origin") || "";
    if (!appUrl) {
      console.error("createCheckout: No app URL available for return URLs");
      return Response.json({ error: "Unable to determine app URL for checkout" }, { status: 500 });
    }

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
            postFlowUrl: appUrl,
            thankYouPageUrl: `${appUrl}/thank-you`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("createCheckout: Wix API error:", JSON.stringify(data));
      return Response.json({ error: data.message || "Failed to create checkout" }, { status: response.status });
    }

    return Response.json({
      redirectUrl: data.checkoutSession.redirectUrl,
      sessionId: data.checkoutSession.id,
    });
  } catch (error) {
    console.error("createCheckout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});