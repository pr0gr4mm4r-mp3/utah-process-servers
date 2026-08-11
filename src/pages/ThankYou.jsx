import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPackage } from "@/lib/packages";

const addressCount = (c) =>
  Math.max(1, [c.respondentAddress, ...(c.additionalAddresses || [])].filter((a) => a && a.trim()).length);

export default function ThankYou() {
  const [status, setStatus] = useState("processing"); // processing | done | error
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const submissionRaw = localStorage.getItem("ups_submission");
        const checkoutRaw = localStorage.getItem("ups_checkout");

        if (!submissionRaw || !checkoutRaw) {
          window.location.href = "/submit";
          return;
        }

        const submission = JSON.parse(submissionRaw);
        const checkout = JSON.parse(checkoutRaw);
        const clientInfo = submission.clientInfo || {};
        let cases = submission.cases || [];

        // Consolidate case blocks into a single Case record per case file.
        // Group by case_number when available; otherwise by respondent name.
        // Same respondent → merge addresses. Different respondent (same case #) → merge into additional_respondents.
        {
          const consolidated = [];
          const groupMap = new Map();
          for (const c of cases) {
            const caseKey = (c.caseNumber || "").trim().toLowerCase();
            const respondentKey = (c.respondentName || "").trim().toLowerCase();
            const key = caseKey || respondentKey;
            if (!key) { consolidated.push({ ...c, additionalRespondents: [] }); continue; }
            if (groupMap.has(key)) {
              const existing = groupMap.get(key);
              if (respondentKey && respondentKey === (existing.respondentName || "").trim().toLowerCase()) {
                // Same respondent — merge addresses
                if (c.respondentAddress && c.respondentAddress.trim()) {
                  existing.additionalAddresses.push(c.respondentAddress.trim());
                }
                for (const a of c.additionalAddresses || []) {
                  if (a && a.trim()) existing.additionalAddresses.push(a.trim());
                }
              } else {
                // Different respondent on the same case — add to additional_respondents
                const addr = [c.respondentAddress, ...(c.additionalAddresses || [])]
                  .filter((a) => a && a.trim()).join("; ");
                existing.additionalRespondents.push({ name: c.respondentName || "", address: addr, attempts: 0 });
              }
              existing.document_urls = [...existing.document_urls, ...(c.document_urls || [])];
              if (c.specialInstructions && c.specialInstructions.trim()) {
                existing.specialInstructions = [existing.specialInstructions, c.specialInstructions]
                  .filter(Boolean).join("\n---\n");
              }
              if (!existing.caseNumber && c.caseNumber) existing.caseNumber = c.caseNumber;
            } else {
              const entry = {
                ...c,
                additionalAddresses: (c.additionalAddresses || []).filter((a) => a && a.trim()),
                additionalRespondents: [],
                document_urls: [...(c.document_urls || [])],
              };
              groupMap.set(key, entry);
              consolidated.push(entry);
            }
          }
          cases = consolidated;
        }

        const paymentMethod = checkout.paymentMethod || "other";
        const isInstant = paymentMethod === "paypal" || paymentMethod === "stripe";

        // Refresh guard
        if (localStorage.getItem("ups_finalized") === "1") {
          if (cancelled) return;
          setStatus("done");
          setSummary({
            caseCount: cases.length,
            total: checkout.packagePrice,
            paymentMethod,
            paymentReceived: isInstant,
          });
          return;
        }
        localStorage.setItem("ups_finalized", "1");

        // Create one Case record per case block.
        // Using single create() (not bulk) so the office "New Case Submission Alert"
        // automation fires for each case (email + SMS to the office).
        const createdIds = [];
        for (const c of cases) {
          const pkg = getPackage(c.packageId);
          const price = (parseFloat(pkg.price) * addressCount(c)).toFixed(2);
          const created = await base44.entities.Case.create({
            case_number: c.caseNumber,
            attorney: c.plaintiff,
            attorney_name: clientInfo.attorneyName,
            firm: clientInfo.firm,
            email: clientInfo.email,
            phone: clientInfo.phone,
            service_type: pkg.serviceType,
            county: "Salt Lake",
            respondent_name: c.respondentName,
            respondent_address: c.respondentAddress,
            additional_addresses: c.additionalAddresses || [],
            additional_respondents: c.additionalRespondents || [],
            respondent_employer: c.respondentEmployer,
            respondent_employer_address: c.respondentEmployerAddress,
            special_instructions: c.specialInstructions,
            document_urls: c.document_urls || [],
            checkout_id: checkout.sessionId || "",
            payment_status: isInstant ? "paid" : "pending",
            payment_method: paymentMethod,
            payment_received: isInstant,
            package_name: pkg.name,
            package_price: price,
            status: "pending",
            submitted_at: submission.submitted_at || new Date().toISOString(),
            text_notifications_opt_in: false,
          });
          createdIds.push(created.id);
        }

        // One consolidated client confirmation email (sendClientEmail also CCs the office)
        const lines = cases
          .map((c, i) => {
            const pkg = getPackage(c.packageId);
            const ref = createdIds[i] ? `UPS-${createdIds[i].slice(-8).toUpperCase()}` : "N/A";
            const respNames = [c.respondentName, ...(c.additionalRespondents || []).map((r) => r.name)].filter(Boolean);
            return `Case ${i + 1} — Ref ${ref}\n  Case #: ${c.caseNumber || "Not provided"}\n  Service: ${pkg.name}\n  Respondent${respNames.length > 1 ? "s" : ""}: ${respNames.join(", ")}`;
          })
          .join("\n\n");

        const clientName = clientInfo.attorneyName || clientInfo.firm || "Valued Client";
        const body = `Dear ${clientName},

Your secure document submission has been received by Utah Process Servers and your payment has been ${isInstant ? "processed" : "noted for verification"}.

Cases Submitted (${cases.length}):
${lines}

${isInstant
  ? "A member of our team will review your submission and contact you within one business hour to confirm service assignment."
  : "Your Zelle/Venmo payment is being verified by our team. Once confirmed, your cases will be activated and a coordinator will contact you within one business hour."}

You can check your case status and payment at any time using the Case Lookup page on our website — enter your email address to view all your cases.

For urgent matters, please call us directly at (801) 755-5445.

Utah Process Servers
Licensed & Bonded in Utah`;

        base44.functions
          .invoke("sendClientEmail", {
            to: clientInfo.email,
            subject: `Submission Confirmed — ${cases.length} Case${cases.length === 1 ? "" : "s"}`,
            body,
          })
          .catch(() => {});

        if (cancelled) return;
        setStatus("done");
        setSummary({
          caseCount: cases.length,
          total: checkout.packagePrice,
          paymentMethod,
          paymentReceived: isInstant,
        });

        // Clean up flow storage (keep ups_finalized as a refresh guard)
        localStorage.removeItem("ups_submission");
        localStorage.removeItem("ups_checkout");
      } catch (err) {
        localStorage.removeItem("ups_finalized");
        if (cancelled) return;
        setStatus("error");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Finalizing your submission...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-24 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't finalize your submission. Please call us at (801) 755-5445 so we can complete your request.
          </p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const paymentMethodLabel = {
    paypal: "PayPal",
    stripe: "Card",
    zelle: "Zelle",
    venmo: "Venmo",
    other: "Other",
  }[summary?.paymentMethod] || "—";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            {summary?.paymentReceived ? "Submission & Payment Confirmed" : "Submission Received"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {summary?.paymentReceived
              ? `Your documents and payment have been securely received by Utah Process Servers. A confirmation has been sent to your email. A coordinator will contact you within one business hour with your case assignment${summary?.caseCount > 1 ? "s" : ""}.`
              : "Your documents have been submitted. Your Zelle/Venmo payment is pending verification by our team — once confirmed, your cases will be activated and a coordinator will contact you within one business hour."}
          </p>

          {summary && (
            <div className="bg-muted/50 border border-border rounded-xl p-6 text-left mb-8 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cases Submitted</span>
                <span className="font-medium">{summary.caseCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{paymentMethodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium">
                  {summary.total ? `$${parseFloat(summary.total).toFixed(2)}` : "—"}
                </span>
              </div>
            </div>
          )}

          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-base gap-2">
              <FileText className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}