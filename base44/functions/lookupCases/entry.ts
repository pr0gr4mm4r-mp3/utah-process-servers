import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const cases = await base44.asServiceRole.entities.Case.filter(
      { email },
      "-submitted_at",
      50
    );

    const results = cases.map((c) => ({
      id: c.id,
      case_number: c.case_number,
      status: c.status,
      payment_status: c.payment_status,
      payment_method: c.payment_method,
      payment_received: c.payment_received,
      service_type: c.service_type,
      package_name: c.package_name,
      package_price: c.package_price,
      county: c.county,
      respondent_name: c.respondent_name,
      submitted_at: c.submitted_at,
    }));

    return Response.json({ cases: results });
  } catch (error) {
    console.error("lookupCases error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});