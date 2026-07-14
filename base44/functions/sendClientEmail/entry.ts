import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: "Missing required fields: to, subject, body" }, { status: 400 });
    }

    // Send from the service role so emails can be delivered to recipients
    // who are not registered app users (e.g. the submitting attorney/client).
    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject,
      body,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("sendClientEmail error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});