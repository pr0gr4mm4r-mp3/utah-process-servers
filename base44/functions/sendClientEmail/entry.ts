import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import nodemailer from 'npm:nodemailer@6.9.13';

const OFFICE_EMAIL = "utahproservers@yahoo.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: "Missing required fields: to, subject, body" }, { status: 400 });
    }

    const result = { office: false, client: false, clientError: null as string | null };

    // 1) Office copy via the built-in SendEmail integration.
    //    The office inbox is a registered app user, so this always succeeds and
    //    keeps the office record even if the client send below fails.
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

    // 2) Client email via Gmail SMTP.
    //    The built-in integration only reaches registered app users, so external
    //    clients are sent through the connected Google Workspace Gmail account,
    //    which can deliver to any address and sends from your own domain.
    if (to === OFFICE_EMAIL) {
      result.client = result.office;
    } else {
      const smtpUser = Deno.env.get("GMAIL_SMTP_USER");
      const smtpPass = Deno.env.get("GMAIL_APP_PASSWORD");
      if (!smtpUser || !smtpPass) {
        result.clientError = "Gmail SMTP credentials not configured";
        console.error("sendClientEmail: GMAIL_SMTP_USER / GMAIL_APP_PASSWORD not set");
      } else {
        console.log("sendClientEmail: authenticating as", smtpUser, "pass length", smtpPass.length);
        try {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: smtpUser, pass: smtpPass },
          });
          await transporter.sendMail({
            from: `"Utah Process Servers" <${smtpUser}>`,
            to,
            subject,
            text: body,
          });
          result.client = true;
        } catch (err) {
          result.clientError = err.message;
          console.error("sendClientEmail: client email via Gmail SMTP failed:", err.message);
        }
      }
    }

    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("sendClientEmail error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});