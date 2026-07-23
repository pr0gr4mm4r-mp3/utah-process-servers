import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sendSms } from "../../shared/twilio.ts";

// Triggered by a StatusLog create automation (event_type = "attempt").
// Texts the client a service-attempt update if they opted in.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const log = payload.data;

    if (!log || log.event_type !== "attempt") {
      return Response.json({ ok: true, skipped: true });
    }

    // Skip logs created when an admin deselects/removes an attempt
    if (log.note && /removed|deselected/i.test(log.note)) {
      return Response.json({ ok: true, skipped: true });
    }

    const caseRecord = await base44.asServiceRole.entities.Case.get(log.case_id);
    if (!caseRecord || !caseRecord.text_notifications_opt_in || !caseRecord.phone) {
      return Response.json({ ok: true, skipped: true });
    }

    const attemptNumber = log.attempt_number;
    const caseRef = caseRecord.case_number ? ` (#${caseRecord.case_number})` : "";
    const message =
      `Utah Process Servers: Service Attempt #${attemptNumber} of 3 has been made on your case${caseRef} for respondent ${caseRecord.respondent_name}. ` +
      (attemptNumber < 3
        ? "We will make another attempt as part of your Standard Service package."
        : "This was our final included attempt. Please contact us if service was unsuccessful.") +
      " Questions? Call (801) 755-5445.";

    const result = await sendSms(caseRecord.phone, message);
    if (!result.ok) console.error("notifyAttemptSms failed:", result.error);
    return Response.json({ ok: result.ok, error: result.error || null });
  } catch (error) {
    console.error("notifyAttemptSms error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});