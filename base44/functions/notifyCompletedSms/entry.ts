import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sendSms } from "../../shared/twilio.ts";

// Triggered by a Case update automation (status = "delivered").
// Texts the client a completion notice only on the transition INTO delivered.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const c = payload.data;
    const old = payload.old_data;

    if (!c) return Response.json({ ok: true, skipped: true });

    // Only fire on the transition INTO delivered
    if (c.status !== "delivered") return Response.json({ ok: true, skipped: true });
    if (old && old.status === "delivered") return Response.json({ ok: true, skipped: true });

    if (!c.text_notifications_opt_in || !c.phone) {
      return Response.json({ ok: true, skipped: true });
    }

    const caseRef = c.case_number ? ` (#${c.case_number})` : "";
    const message =
      `Utah Process Servers: Your case${caseRef} has been completed — documents have been successfully served on ${c.respondent_name}. ` +
      `A proof of service will follow. Questions? Call (801) 755-5445.`;

    const result = await sendSms(c.phone, message);
    if (!result.ok) console.error("notifyCompletedSms failed:", result.error);
    return Response.json({ ok: result.ok, error: result.error || null });
  } catch (error) {
    console.error("notifyCompletedSms error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});