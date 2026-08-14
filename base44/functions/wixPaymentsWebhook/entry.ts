import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import jwt from 'npm:jsonwebtoken@9.0.2';

Deno.serve(async (req) => {
  try {
    const body = await req.text();

    const WEBHOOK_PUBLIC_KEY = Deno.env.get("WIX_CHECKOUT_WEBHOOK_PUBLIC_KEY") || Deno.env.get("WIX_PAYMENTS_WEBHOOK_PUBLIC_KEY");
    if (!WEBHOOK_PUBLIC_KEY) {
      console.error("Missing WIX_CHECKOUT_WEBHOOK_PUBLIC_KEY / WIX_PAYMENTS_WEBHOOK_PUBLIC_KEY");
      return new Response("Configuration error", { status: 500 });
    }

    let rawPayload;
    try {
      rawPayload = jwt.verify(body, WEBHOOK_PUBLIC_KEY, { algorithms: ["RS256"] });
    } catch (verifyError) {
      console.error("JWT verification failed:", verifyError.message);
      return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(rawPayload.data);
    const eventData = JSON.parse(event.data);

    if (event.eventType === "wix.ecom.v1.order_approved") {
      const order = eventData.actionEvent.body.order;
      const checkoutId = order.checkoutId;
      const buyerEmail = order.buyerInfo?.email;
      const totalAmount = order.priceSummary?.total?.amount;

      console.log(`Order approved - checkoutId: ${checkoutId}, email: ${buyerEmail}, amount: ${totalAmount}`);

      const base44 = createClientFromRequest(req);
      const cases = await base44.asServiceRole.entities.Case.filter({ checkout_id: checkoutId });

      if (cases.length > 0) {
        // Idempotent: only update if not already marked paid
        if (cases[0].payment_status !== "paid") {
          await base44.asServiceRole.entities.Case.update(cases[0].id, {
            payment_status: "paid",
            payment_received: true,
          });
          console.log(`Updated case ${cases[0].id} payment status to paid`);
        } else {
          console.log(`Case ${cases[0].id} already marked paid — skipping (idempotent)`);
        }
      } else {
        console.log(`No case found yet for checkoutId ${checkoutId} - payment recorded, awaiting document submission`);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error.message, error.stack);
    return new Response("Error", { status: 500 });
  }
});