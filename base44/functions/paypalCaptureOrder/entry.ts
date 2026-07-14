Deno.serve(async (req) => {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("paypalCaptureOrder: Missing PayPal credentials");
      return Response.json({ error: "PayPal credentials not configured" }, { status: 500 });
    }

    // 1. Get access token from PayPal
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("paypalCaptureOrder: Failed to get access token", JSON.stringify(tokenData));
      return Response.json({ error: "Failed to authenticate with PayPal" }, { status: 500 });
    }

    // 2. Capture the order
    const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      console.error("paypalCaptureOrder: Capture failed", JSON.stringify(captureData));
      return Response.json({ error: captureData.message || "Payment capture failed", status: captureData.status }, { status: 400 });
    }

    // 3. Verify the payment status
    if (captureData.status === "COMPLETED") {
      return Response.json({ success: true, status: "COMPLETED", orderId: orderID });
    }

    // Not completed yet (e.g., PENDING)
    return Response.json({ success: false, status: captureData.status, orderId: orderID });
  } catch (error) {
    console.error("paypalCaptureOrder error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});