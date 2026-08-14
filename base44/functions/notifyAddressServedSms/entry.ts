import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sendSms } from "../../shared/twilio.ts";

// Triggered by a StatusLog create automation (event_type = "address_served").
// Texts the client a completion notice — the same notification sent when a
// whole case is marked Served — when an individual address is marked served.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const log = payload.data;

    if (!log || log.event_type !== "address_served") {
      return Response.json({ ok: true, skipped: true });
    }

    // Skip logs created when an admin unmarks an address
    if (log.note && /unmarked/i.test(log.note)) {
      return Response.json({ ok: true, skipped: true });
    }

    const caseRecord = await base44.asServiceRole.entities.Case.get(log.case_id);
    if (!caseRecord || !caseRecord.text_notifications_opt_in || !caseRecord.phone) {
      return Response.json({ ok: true, skipped: true });
    }

    const caseRef = caseRecord.case_number ? ` (#${caseRecord.case_number})` : "";
    const message =
      `Utah Process Servers: Your case${caseRef} has been completed — documents have been successfully served on ${caseRecord.respondent_name}. ` +
      `A proof of service will follow. Questions? Call (801) 755-5445.`;

    const result = await sendSms(caseRecord.phone, message);
    if (!result.ok) console.error("notifyAddressServedSms failed:", result.error);
    return Response.json({ ok: result.ok, error: result.error || null });
  } catch (error) {
    console.error("notifyAddressServedSms error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});