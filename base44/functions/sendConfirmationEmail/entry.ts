import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, attorney, caseNumber, isInstant, checkout, submission } = await req.json();

    if (!to) {
      return Response.json({ error: "Missing recipient email (to)" }, { status: 400 });
    }

    const fd = (submission && submission.formData) || {};
    const serviceType = (checkout && (checkout.serviceType || checkout.packageName)) || "Process Service";
    const county = fd.county || "—";
    const respondent = fd.respondentName || "—";
    const files = (submission && submission.document_urls ? submission.document_urls : [])
      .map((f) => f.name)
      .join(", ") || "None";
    const fileCount = (submission && submission.document_urls ? submission.document_urls : []).length;
    const clientName = attorney || fd.attorney || "Valued Client";
    const paymentStatusWord = isInstant ? "processed" : "noted for verification";

    const followUp = isInstant
      ? "A member of our team will review your submission and contact you within one business hour to confirm service assignment."
      : "Your Zelle/Venmo payment is being verified by our team. Once confirmed, your case will be activated and a coordinator will contact you within one business hour.";

    const body = `Dear ${clientName},

Your secure document submission has been received by Utah Process Servers and your payment has been ${paymentStatusWord}.

Submission Details:
- Case Number: ${caseNumber || fd.caseNumber || "Not provided"}
- Service Type: ${serviceType}
- County: ${county} County
- Respondent: ${respondent}
- Files Submitted: ${files}${fileCount ? ` (${fileCount} file${fileCount > 1 ? "s" : ""})` : ""}

${followUp}

For urgent matters, please call us directly at (801) 755-5445.

Utah Process Servers
Licensed & Bonded in Utah`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      subject: `Submission Confirmed — Case ${caseNumber || fd.caseNumber || "N/A"}`,
      body,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("sendConfirmationEmail error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});