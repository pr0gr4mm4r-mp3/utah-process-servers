import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const c = payload.data;
    if (!c) return Response.json({ ok: true });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: "contact@utahproservers.com",
      subject: `🔔 New Case Submitted — ${c.case_number || "No Case #"} | ${c.respondent_name}`,
      body: `A new process service request was submitted through the website.

CASE DETAILS
────────────────────────────────
Case Number:    ${c.case_number || "Not provided"}
Attorney:       ${c.attorney}
Firm:           ${c.firm || "Not provided"}
Client Email:   ${c.email}
Client Phone:   ${c.phone || "Not provided"}

SERVICE DETAILS
────────────────────────────────
Service Type:   ${c.service_type}
County:         ${c.county} County
Respondent:     ${c.respondent_name}
Address:        ${c.respondent_address || "Not provided"}

Documents:      ${c.document_urls?.length > 0 ? c.document_urls.map(d => d.name).join(", ") : "None attached"}

Special Instructions:
${c.special_instructions || "None"}

────────────────────────────────
Log in to the Admin Dashboard to update status and assign a server.
`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});