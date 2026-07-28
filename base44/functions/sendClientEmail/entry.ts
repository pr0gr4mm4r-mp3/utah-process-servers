import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OFFICE_EMAIL = "utahproservers@yahoo.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: "Missing required fields: to, subject, body" }, { status: 400 });
    }

    const result = { office: false, client: false, clientError: null as string | null };

    // 1) Office copy FIRST.
    //    The built-in SendEmail integration only delivers to registered app
    //    users. The office inbox is registered, so this always succeeds. Sending
    //    it first guarantees the office keeps its record even when the client
    //    email (below) fails.
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: OFFICE_EMAIL,
        subject: `[COPY] ${subject}`,
        body: `This is a copy of a notification sent to ${to}.\n\n──────────────────────────────\n\n${body}`,
      });
      result.office = true;
    } catch (err) {
      console.error("sendClientEmail: office copy failed:", err.message);
    }

    // 2) Client email.
    //    External recipients (the submitting attorney/client) are rejected by
    //    the built-in integration. We attempt it separately and never let a
    //    failure here block or undo the office copy above.
    if (to === OFFICE_EMAIL) {
      result.client = result.office;
    } else {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body });
        result.client = true;
      } catch (err) {
        result.clientError = err.message;
        console.error("sendClientEmail: client email failed:", err.message);
      }
    }

    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("sendClientEmail error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});