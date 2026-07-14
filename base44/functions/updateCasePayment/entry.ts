import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { caseId, paymentMethod, checkoutId, isInstant } = await req.json();

    if (!caseId) {
      return Response.json({ error: "Case ID is required" }, { status: 400 });
    }

    const update = {
      payment_method: paymentMethod || "other",
      checkout_id: checkoutId || "",
    };

    if (isInstant) {
      update.payment_status = "paid";
      update.payment_received = true;
    }

    await base44.asServiceRole.entities.Case.update(caseId, update);

    return Response.json({ success: true });
  } catch (error) {
    console.error("updateCasePayment error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});