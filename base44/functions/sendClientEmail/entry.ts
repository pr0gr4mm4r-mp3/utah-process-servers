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
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");
        if (!accessToken) {
          throw new Error("Gmail OAuth access token not available");
        }

        // Build a minimal RFC 2822 message (ASCII-only headers/body here).
        const rawMessage =
          `From: "Utah Process Servers" <contact@utahproservers.com>\r\n` +
          `To: ${to}\r\n` +
          `Subject: ${subject}\r\n` +
          `Content-Type: text/plain; charset=utf-8\r\n` +
          `MIME-Version: 1.0\r\n` +
          `\r\n` +
          `${body}`;

        // base64url-encode the UTF-8 bytes for the Gmail API.
        const bytes = new TextEncoder().encode(rawMessage);
        let bin = "";
        for (const b of bytes) bin += String.fromCharCode(b);
        const encoded = btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

        const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: encoded }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Gmail API ${res.status}: ${errText}`);
        }

        result.client = true;
      } catch (err) {
        result.clientError = err.message;
        console.error("sendClientEmail: client email via Gmail API failed:", err.message);

        // Fallback: try the built-in SendEmail integration (works for external
        // addresses on a paid plan with a custom domain connected).
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body });
          result.client = true;
          result.clientError = null;
        } catch (fallbackErr) {
          console.error("sendClientEmail: built-in SendEmail fallback failed:", fallbackErr.message);
        }
      }
    }

    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("sendClientEmail error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});