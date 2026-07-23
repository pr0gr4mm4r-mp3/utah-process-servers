// Shared Twilio SMS helper used by all notification backend functions.
// To disable SMS globally, set the OFFICE_SMS_DISABLE env var to "true".

// Normalize a US phone number to E.164 (+1XXXXXXXXXX). Returns null if invalid.
export function normalizePhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.length > 11) return "+" + digits;
  return null;
}

// Send an SMS via the Twilio REST API using an API Key (SID + Secret).
// Returns { ok: true, sid } on success or { ok: false, error } on failure.
export async function sendSms(to, body) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const apiKeySid = Deno.env.get("TWILIO_API_KEY_SID");
  const apiKeySecret = Deno.env.get("TWILIO_API_KEY_SECRET");
  const from = Deno.env.get("TWILIO_FROM_NUMBER");

  if (!accountSid || !apiKeySid || !apiKeySecret || !from) {
    const missing = [
      !accountSid && "TWILIO_ACCOUNT_SID",
      !apiKeySid && "TWILIO_API_KEY_SID",
      !apiKeySecret && "TWILIO_API_KEY_SECRET",
      !from && "TWILIO_FROM_NUMBER",
    ].filter(Boolean).join(", ");
    return { ok: false, error: `Twilio not configured — missing secrets: ${missing}` };
  }

  if (Deno.env.get("OFFICE_SMS_DISABLE") === "true") {
    return { ok: true, skipped: true };
  }

  const toNormalized = normalizePhone(to);
  if (!toNormalized) {
    return { ok: false, error: `Invalid phone number: ${to}` };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${apiKeySid}:${apiKeySecret}`);
  const params = new URLSearchParams({ To: toNormalized, From: from, Body: body });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Twilio SMS error:", JSON.stringify(data));
      return { ok: false, error: data.message || JSON.stringify(data) };
    }
    return { ok: true, sid: data.sid };
  } catch (err) {
    console.error("Twilio SMS fetch failed:", err.message);
    return { ok: false, error: err.message };
  }
}