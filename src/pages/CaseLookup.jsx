import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Clock, CheckCircle, AlertCircle, Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

const statusConfig = {
  pending: { label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-200" },
  in_progress: { label: "In Progress", color: "text-blue-700 bg-blue-50 border-blue-200" },
  delivered: { label: "Served", color: "text-green-700 bg-green-50 border-green-200" },
  failed: { label: "Failed", color: "text-red-700 bg-red-50 border-red-200" },
};

const paymentConfig = {
  pending: { label: "Payment Pending", color: "text-amber-700 bg-amber-50 border-amber-200" },
  paid: { label: "Paid", color: "text-green-700 bg-green-50 border-green-200" },
};

const paymentMethodLabels = {
  paypal: "PayPal",
  stripe: "Card",
  zelle: "Zelle",
  venmo: "Venmo",
  other: "Other",
};

export default function CaseLookup() {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null);
  const [payCase, setPayCase] = useState(null);
  const [paidNotice, setPaidNotice] = useState(searchParams.get("paid") === "1");

  const performSearch = async (emailToSearch) => {
    setSearching(true);
    setError(null);
    setPaidNotice(false);
    try {
      const res = await base44.functions.invoke("lookupCases", { email: emailToSearch });
      setCases(res.data?.cases || []);
    } catch (err) {
      setError("Unable to look up cases. Please try again or call us at (801) 755-5445.");
    }
    setSearching(false);
    setSearched(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    performSearch(email.trim());
  };

  // Auto-search if email is in URL (e.g. after payment redirect)
  useEffect(() => {
    if (initialEmail) {
      performSearch(initialEmail);
    }
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1A1C1E] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#C4A265]/15 border border-[#C4A265]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Search className="w-5 h-5 text-[#C4A265]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-3">
                Case Status Portal
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
                Look Up Your Case
              </h1>
              <p className="mt-4 text-white/50 text-base leading-relaxed max-w-xl">
                Enter the email address you used when submitting your documents to check service status, payment status, and complete pending payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Results */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="bg-background flex-1 h-12"
            required
          />
          <Button type="submit" disabled={searching} className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
            {searching ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Look Up Case
              </span>
            )}
          </Button>
        </form>

        {paidNotice && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">Payment Confirmed</p>
              <p className="text-sm text-green-700">Your payment has been received. Your case will be activated shortly.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {searched && cases.length === 0 && !error && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No cases found for this email address.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">If you submitted with a different email, try searching again.</p>
          </div>
        )}

        {/* Results */}
        {cases.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{cases.length} case{cases.length > 1 ? "s" : ""} found</p>
            {cases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-border rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold">
                        Ref: UPS-{c.id ? c.id.slice(-8).toUpperCase() : "——"}
                      </span>
                      {c.case_number && (
                        <span className="text-xs text-muted-foreground">Case #{c.case_number}</span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                      {c.service_type || "Process Service"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Respondent: {c.respondent_name || "—"} &middot; {c.county || "Salt Lake"} County
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Submitted: {formatDate(c.submitted_at)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${statusConfig[c.status]?.color || statusConfig.pending.color}`}>
                      {statusConfig[c.status]?.label || "Pending"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${paymentConfig[c.payment_status]?.color || paymentConfig.pending.color}`}>
                      {paymentConfig[c.payment_status]?.label || "Payment Pending"}
                    </span>
                  </div>
                </div>

                {c.payment_status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>
                          Payment of ${c.package_price ? parseFloat(c.package_price).toFixed(2) : "—"} is pending
                          {c.payment_method && c.payment_method !== "other" && ` (currently ${paymentMethodLabels[c.payment_method] || c.payment_method})`}
                        </span>
                      </p>
                    </div>
                    <Button
                      onClick={() => setPayCase({ ...c, email: email.trim() })}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex-shrink-0"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Now
                    </Button>
                  </div>
                )}

                {c.payment_status === "paid" && c.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary/60 flex-shrink-0" />
                    Payment confirmed. A coordinator will contact you within one business hour.
                  </div>
                )}

                {c.status === "delivered" && (
                  <div className="mt-4 pt-4 border-t border-border text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    Service has been completed.
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {payCase && (
        <PaymentMethodSelector
          pkg={{ name: payCase.package_name, price: payCase.package_price, serviceType: payCase.service_type }}
          existingCase={payCase}
          onClose={() => setPayCase(null)}
        />
      )}

      <Footer />
    </div>
  );
}