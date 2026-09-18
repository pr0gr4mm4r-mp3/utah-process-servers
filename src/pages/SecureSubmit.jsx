import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Lock, FileText, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import ClientInfoSection from "@/components/submit/ClientInfoSection";
import CaseBlock from "@/components/submit/CaseBlock";
import { getPackage } from "@/lib/packages";

const makeId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
  String(Date.now() + Math.random());

const newCase = (packageId) => ({
  id: makeId(),
  packageId,
  caseNumber: "",
  plaintiff: "",
  respondentName: "",
  respondentAddress: "",
  additionalAddresses: [],
  respondentEmployer: "",
  respondentEmployerAddress: "",
  specialInstructions: "",
  files: [],
});

const addressCount = (c) =>
  Math.max(1, [c.respondentAddress, ...(c.additionalAddresses || [])].filter((a) => a && a.trim()).length);

export default function SecureSubmit() {
  const [clientInfo, setClientInfo] = useState({ attorneyName: "", firm: "", pointOfContact: "", email: "", phone: "" });
  const [cases, setCases] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [defaultPkgId, setDefaultPkgId] = useState("standard");

  useEffect(() => {
    const raw = localStorage.getItem("ups_package");
    let pid = "standard";
    if (raw) {
      try {
        pid = JSON.parse(raw).id || "standard";
      } catch {
        pid = "standard";
      }
    }
    setDefaultPkgId(pid);
    setCases([newCase(pid)]);
  }, []);

  const total = cases.reduce(
    (sum, c) => sum + parseFloat(getPackage(c.packageId).price) * addressCount(c),
    0
  );
  const checkoutPkg = {
    name: `${cases.length} Case${cases.length === 1 ? "" : "s"}`,
    price: total.toFixed(2),
  };

  const addCase = () => setCases((prev) => [...prev, newCase(prev[0]?.packageId || defaultPkgId)]);
  const updateCase = (i, updated) => setCases((prev) => prev.map((c, idx) => (idx === i ? updated : c)));
  const removeCase = (i) => setCases((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      setUploading(true);
      const casesPayload = [];
      for (const c of cases) {
        const document_urls = [];
        for (const f of c.files || []) {
          const { file_url } = await base44.integrations.Core.UploadFile({ file: f.file });
          document_urls.push({ name: f.name, url: file_url });
        }
        casesPayload.push({
          packageId: c.packageId,
          caseNumber: c.caseNumber,
          plaintiff: c.plaintiff,
          respondentName: c.respondentName,
          respondentAddress: c.respondentAddress,
          additionalAddresses: (c.additionalAddresses || []).filter((a) => a.trim() !== ""),
          respondentEmployer: c.respondentEmployer,
          respondentEmployerAddress: c.respondentEmployerAddress,
          specialInstructions: c.specialInstructions,
          document_urls,
        });
      }
      setUploading(false);

      localStorage.setItem(
        "ups_submission",
        JSON.stringify({
          clientInfo,
          cases: casesPayload,
          submitted_at: new Date().toISOString(),
        })
      );

      setSaved(true);
      setShowPayment(true);
      setSubmitting(false);
    } catch (err) {
      toast.error("Submission failed. Please try again or call us directly.");
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-[#1A1C1E] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#C4A265]/15 border border-[#C4A265]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Lock className="w-5 h-5 text-[#C4A265]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-3">
                Encrypted Document Portal
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
                Secure Document Submission
              </h1>
              <p className="mt-4 text-white/50 text-base leading-relaxed max-w-xl">
                Submit one or more cases for process service. Each case can use its own service package
                and includes its own documents. You'll complete a single payment for all cases at the end.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { icon: Shield, label: "256-bit SSL Encryption" },
              { icon: Lock, label: "Confidential Handling" },
              { icon: FileText, label: "Court-Admissible Records" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-white/40">
                <badge.icon className="w-4 h-4 text-[#C4A265]/60" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1 — Client info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                1
              </span>
              <h2 className="font-heading text-xl font-semibold text-foreground">Client / Billing Information</h2>
            </div>
            <ClientInfoSection value={clientInfo} onChange={setClientInfo} />
          </motion.div>

          {/* Section 2 — Cases */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                  2
                </span>
                <h2 className="font-heading text-xl font-semibold text-foreground">Cases</h2>
              </div>
              <button
                type="button"
                onClick={addCase}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add another case
              </button>
            </div>
            <div className="space-y-8">
              {cases.map((c, i) => (
                <CaseBlock
                  key={c.id}
                  index={i}
                  data={c}
                  onChange={(updated) => updateCase(i, updated)}
                  onRemove={() => removeCase(i)}
                  canRemove={cases.length > 1}
                />
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4"
          >
            <div className="space-y-1">
              <p className="text-sm text-foreground font-medium">
                Total due: ${total.toFixed(2)}
                {cases.length > 1 && (
                  <span className="text-muted-foreground font-normal"> ({cases.length} cases)</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                Each service address is charged at the full package price. You'll complete one payment for
                all cases on the next step.
              </p>
            </div>
            {saved ? (
              <Button
                type="button"
                onClick={() => setShowPayment(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-base tracking-wide flex-shrink-0"
              >
                <span className="flex items-center gap-2">
                  Complete Payment
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-base tracking-wide flex-shrink-0"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {uploading ? "Uploading Files..." : "Saving..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            )}
          </motion.div>
        </form>
      </div>

      {showPayment && (
        <PaymentMethodSelector pkg={checkoutPkg} onClose={() => setShowPayment(false)} />
      )}

      <Footer />
    </div>
  );
}