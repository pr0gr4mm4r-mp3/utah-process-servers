import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ThankYou() {
  const [status, setStatus] = useState("processing"); // processing | done | error
  const [caseInfo, setCaseInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const submissionRaw = localStorage.getItem("ups_submission");
        const checkoutRaw = localStorage.getItem("ups_checkout");

        if (!submissionRaw || !checkoutRaw) {
          // Nothing to finalize — send user back to start of the flow
          window.location.href = "/submit";
          return;
        }

        const submission = JSON.parse(submissionRaw);
        const checkout = JSON.parse(checkoutRaw);
        const fd = submission.formData || {};

        const paymentMethod = checkout.paymentMethod || "other";
        const isInstant = paymentMethod === "paypal" || paymentMethod === "stripe";

        // Prevent double-creation on refresh (set synchronously before the async create)
        if (localStorage.getItem("ups_finalized") === "1") {
          if (cancelled) return;
          setStatus("done");
          setCaseInfo({
            caseNumber: fd.caseNumber,
            serviceType: checkout.serviceType || checkout.packageName,
            county: fd.county,
            packagePrice: checkout.packagePrice,
            paymentMethod,
            paymentReceived: isInstant,
          });
          return;
        }
        localStorage.setItem("ups_finalized", "1");

        const created = await base44.entities.Case.create({
          case_number: fd.caseNumber,
          attorney: fd.attorney,
          attorney_name: fd.attorneyName,
          firm: fd.firm,
          email: fd.email,
          phone: fd.phone,
          service_type: checkout.serviceType || checkout.packageName,
          county: fd.county,
          respondent_name: fd.respondentName,
          respondent_address: fd.respondentAddress,
          additional_addresses: fd.additionalAddresses || [],
          respondent_employer: fd.respondentEmployer,
          respondent_employer_address: fd.respondentEmployerAddress,
          special_instructions: fd.specialInstructions,
          document_urls: submission.document_urls || [],
          checkout_id: checkout.sessionId || "",
          payment_status: isInstant ? "paid" : "pending",
          payment_method: paymentMethod,
          payment_received: isInstant,
          package_name: checkout.packageName || "",
          package_price: checkout.packagePrice || "",
          status: "pending",
          submitted_at: submission.submitted_at || new Date().toISOString(),
          text_notifications_opt_in: fd.textNotificationsOptIn || false,
        });

        // Client confirmation email (sent server-side so external emails are delivered)
        base44.functions.invoke("sendConfirmationEmail", {
          to: fd.email,
          attorney: fd.attorney,
          caseNumber: fd.caseNumber,
          caseId: created.id,
          isInstant,
          checkout,
          submission,
        }).catch(() => {});

        if (cancelled) return;
        setStatus("done");
        setCaseInfo({
          caseNumber: fd.caseNumber,
          serviceType: checkout.serviceType || checkout.packageName,
          county: fd.county,
          packagePrice: checkout.packagePrice,
          paymentMethod,
          paymentReceived: isInstant,
        });

        // Clean up the flow storage (keep ups_finalized as a refresh guard)
        localStorage.removeItem("ups_submission");
        localStorage.removeItem("ups_checkout");
      } catch (err) {
        localStorage.removeItem("ups_finalized");
        if (cancelled) return;
        setStatus("error");
      }
    };

    run();
    return () => { cancelled = true; };
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
          <p className="text-muted-foreground mb-6">We couldn't finalize your submission. Please call us at (801) 755-5445 so we can complete your request.</p>
          <Link to="/"><Button variant="outline">Back to Home</Button></Link>
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
  }[caseInfo?.paymentMethod] || "—";

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
            {caseInfo?.paymentReceived ? "Submission & Payment Confirmed" : "Submission Received"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {caseInfo?.paymentReceived
              ? "Your documents and payment have been securely received by Utah Process Servers. A confirmation has been sent to your email. A coordinator will contact you within one business hour with your case assignment."
              : "Your documents have been submitted. Your Zelle/Venmo payment is pending verification by our team — once confirmed, your case will be activated and a coordinator will contact you within one business hour."}
          </p>

          {caseInfo && (
            <div className="bg-muted/50 border border-border rounded-xl p-6 text-left mb-8 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Case Number</span>
                <span className="font-medium">{caseInfo.caseNumber || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Type</span>
                <span className="font-medium">{caseInfo.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">County</span>
                <span className="font-medium">{caseInfo.county} County</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{paymentMethodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">${caseInfo.packagePrice ? parseFloat(caseInfo.packagePrice).toFixed(2) : "—"}</span>
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