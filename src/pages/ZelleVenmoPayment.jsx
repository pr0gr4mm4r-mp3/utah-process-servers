import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, AlertCircle, Clock, CheckCircle, Smartphone } from "lucide-react";

export default function ZelleVenmoPayment() {
  const [searchParams] = useSearchParams();
  const method = searchParams.get("method") || "zelle"; // "zelle" or "venmo"
  const packageName = searchParams.get("packageName") || "";
  const packagePrice = searchParams.get("packagePrice") || "";
  const serviceType = searchParams.get("serviceType") || "";
  const caseId = searchParams.get("caseId") || "";
  const lookupEmail = searchParams.get("email") || "";

  const [config, setConfig] = useState({ zelleEmail: "", venmoHandle: "" });

  useEffect(() => {
    base44.functions.invoke("getPaymentConfig")
      .then((res) => {
        setConfig(res.data || {});
      })
      .catch(() => {
        setConfig({});
      });
  }, []);

  const [selectedMethod, setSelectedMethod] = useState(method);
  const isVenmo = selectedMethod === "venmo";
  const label = isVenmo ? "Venmo" : "Zelle";
  const zelleRecipient = config.zelleEmail || "utahproservers@yahoo.com";
  const venmoRecipient = config.venmoHandle || "";
  const recipient = isVenmo ? venmoRecipient : zelleRecipient;

  const handleProceedToSubmit = async () => {
    if (caseId) {
      try {
        await base44.functions.invoke("updateCasePayment", {
          caseId,
          paymentMethod: selectedMethod,
          isInstant: false,
        });
      } catch {}
      window.location.href = `/case-lookup?email=${encodeURIComponent(lookupEmail)}`;
      return;
    }
    localStorage.setItem("ups_checkout", JSON.stringify({
      sessionId: `${selectedMethod}-manual-${Date.now()}`,
      packageName,
      packagePrice,
      serviceType,
      paymentMethod: selectedMethod,
    }));
    window.location.href = "/thank-you";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-[#1A1C1E] pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <Link to="/submit" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-8">
            ← Back to Documents
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#C4A265]/15 border border-[#C4A265]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Smartphone className="w-5 h-5 text-[#C4A265]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-3">
                Manual Payment
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
                Pay via {label}
              </h1>
              <p className="mt-4 text-white/50 text-base leading-relaxed max-w-xl">
                Send your payment using the information below. Services will begin only after payment is verified by our team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16 space-y-8">

        {/* Method toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setSelectedMethod("zelle")}
            className={`flex-1 py-4 flex items-center justify-center gap-2.5 text-sm font-semibold transition-colors ${
              !isVenmo
                ? "bg-[#6D1ED4] text-white"
                : "bg-white text-muted-foreground hover:bg-muted/30"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Zelle
          </button>
          <button
            onClick={() => setSelectedMethod("venmo")}
            className={`flex-1 py-4 flex items-center justify-center gap-2.5 text-sm font-semibold transition-colors ${
              isVenmo
                ? "bg-[#008CFF] text-white"
                : "bg-white text-muted-foreground hover:bg-muted/30"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Venmo
          </button>
        </div>

        {/* Important notice */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800 mb-1">Payment Required Before Service</p>
            <p className="text-amber-700">
              No services will be rendered until payment has been received and manually verified by our team.
              Once confirmed, you will receive an email notification and your case will be assigned to a process server.
            </p>
          </div>
        </motion.div>

        {/* Order summary */}
        {packageName && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-border rounded-xl p-6"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-4">Order Summary</p>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold text-foreground">{packageName}</p>
                {serviceType && <p className="text-muted-foreground text-xs mt-0.5">{serviceType}</p>}
              </div>
              <p className="font-bold text-xl text-foreground">${parseFloat(packagePrice).toFixed(2)}</p>
            </div>
          </motion.div>
        )}

        {/* Payment info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border rounded-xl p-8"
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-6">
            Send Payment To
          </p>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* QR placeholder */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-40 h-40 bg-muted/40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-4">
                <Smartphone className="w-8 h-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground leading-tight">QR Code</p>
                <p className="text-xs text-muted-foreground leading-tight">(scan in {label} app)</p>
              </div>
              <p className="text-xs text-muted-foreground">Open {label} app → Scan</p>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {isVenmo ? "Venmo Handle" : "Zelle Email / Phone"}
                </p>
                {recipient ? (
                  <p className="font-bold text-2xl text-foreground font-mono">{recipient}</p>
                ) : (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {isVenmo
                      ? "Venmo handle not configured yet. Please call (801) 755-5445 to arrange payment."
                      : "Zelle email not configured yet. Please call (801) 755-5445 to arrange payment."}
                  </p>
                )}
              </div>

              {packagePrice && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount to Send</p>
                  <p className="font-bold text-xl text-primary">${parseFloat(packagePrice).toFixed(2)}</p>
                </div>
              )}

              <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground text-xs uppercase tracking-wide mb-2">Instructions</p>
                <p>1. Open your {label} app and search for the {isVenmo ? "handle" : "email/phone"} above.</p>
                <p>2. Send exactly <strong className="text-foreground">${packagePrice ? parseFloat(packagePrice).toFixed(2) : "the amount shown"}</strong>.</p>
                <p>3. In the note/memo, include your name and "Process Service".</p>
                <p>4. Click below once you've sent payment — our team will verify it and begin service.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification notice */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          {[
            { icon: Clock, text: "Payment verification typically takes 1–2 business hours." },
            { icon: CheckCircle, text: "You will receive an email confirmation once payment is verified and your case is assigned." },
            { icon: AlertCircle, text: "No services will be rendered until payment is confirmed. Do not send documents before completing payment." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary/60" />
              <p>{item.text}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border"
        >
          <Link to="/submit" className="flex-1">
            <Button variant="outline" className="w-full">← Back to Documents</Button>
          </Link>
          <Button
            onClick={handleProceedToSubmit}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5"
          >
            I've Sent Payment — Complete Submission
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}