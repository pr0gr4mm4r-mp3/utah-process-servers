import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Lock, Upload, FileText, X, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

export default function SecureSubmit() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    caseNumber: "",
    attorney: "",
    firm: "",
    email: "",
    phone: "",
    county: "Salt Lake",
    respondentName: "",
    respondentAddress: "",
    respondentEmployer: "",
    respondentEmployerAddress: "",
    specialInstructions: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("ups_package");
    if (!raw) {
      window.location.href = "/pricing";
      return;
    }
    try {
      setPkg(JSON.parse(raw));
    } catch {
      window.location.href = "/pricing";
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter((f) => f.size <= 25 * 1024 * 1024);
    const invalid = selected.filter((f) => f.size > 25 * 1024 * 1024);
    if (invalid.length > 0) toast.error("Some files exceed the 25MB limit and were excluded.");
    setFiles((prev) => [...prev, ...valid.map((f) => ({ file: f, name: f.name, size: f.size }))]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload files
      const uploadedUrls = [];
      if (files.length > 0) {
        setUploading(true);
        for (const fileObj of files) {
          const { file_url } = await base44.integrations.Core.UploadFile({ file: fileObj.file });
          uploadedUrls.push({ name: fileObj.name, url: file_url });
        }
        setUploading(false);
      }

      // Persist submission for the payment step — case is created after payment
      localStorage.setItem("ups_submission", JSON.stringify({
        formData,
        document_urls: uploadedUrls,
        submitted_at: new Date().toISOString(),
      }));

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
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#C4A265]/15 border border-[#C4A265]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Lock className="w-5 h-5 text-[#C4A265]" />
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-3">
                Step 2 of 2 — Encrypted Document Portal
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
                Secure Document Submission
              </h1>
              {pkg && (
                <p className="mt-3 text-sm text-[#C4A265] font-medium">
                  Selected package: {pkg.name} — ${parseFloat(pkg.price).toFixed(2)}
                </p>
              )}
              <p className="mt-4 text-white/50 text-base leading-relaxed max-w-xl">
                Submit your legal documents and case details for process service assignment.
                All uploads are encrypted in transit and at rest. After submission, you'll complete
                payment for your selected service package.
              </p>
            </div>
          </div>

          {/* Trust badges */}
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

          {/* Section 1 — Attorney Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">1</span>
              <h2 className="font-heading text-xl font-semibold text-foreground">Attorney / Client Information</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 bg-muted/30 border border-border rounded-xl p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Attorney / Client Name *</label>
                <Input required value={formData.attorney} onChange={(e) => setFormData({ ...formData, attorney: e.target.value })} placeholder="John Smith, Esq." className="bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Law Firm / Organization</label>
                <Input value={formData.firm} onChange={(e) => setFormData({ ...formData, firm: e.target.value })} placeholder="Smith & Associates" className="bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email Address *</label>
                <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="attorney@firm.com" className="bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone Number *</label>
                <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(801) 000-0000" className="bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Case / File Number</label>
                <Input value={formData.caseNumber} onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })} placeholder="e.g. 2024-CV-001234" className="bg-background" />
              </div>
            </div>
          </motion.div>

          {/* Section 2 — Service Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">2</span>
              <h2 className="font-heading text-xl font-semibold text-foreground">Service Details</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 bg-muted/30 border border-border rounded-xl p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">County for Service</label>
                <Input value="Salt Lake County" disabled className="bg-muted/50 text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Respondent / Subject Name *</label>
                <Input required value={formData.respondentName} onChange={(e) => setFormData({ ...formData, respondentName: e.target.value })} placeholder="Full legal name" className="bg-background" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">Known Address</label>
                <Input value={formData.respondentAddress} onChange={(e) => setFormData({ ...formData, respondentAddress: e.target.value })} placeholder="Street, City, State, ZIP" className="bg-background" />
              </div>
              <div className="sm:col-span-2 border-t border-border pt-6 mt-2">
                <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold mb-4">Respondent Employment Information <span className="normal-case font-normal">(optional)</span></p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Company / Employer Name</label>
                    <Input value={formData.respondentEmployer} onChange={(e) => setFormData({ ...formData, respondentEmployer: e.target.value })} placeholder="Employer or company name" className="bg-background" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Work Address</label>
                    <Input value={formData.respondentEmployerAddress} onChange={(e) => setFormData({ ...formData, respondentEmployerAddress: e.target.value })} placeholder="Street, City, State, ZIP" className="bg-background" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">Special Instructions</label>
                <Textarea value={formData.specialInstructions} onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })} placeholder="Gated community, specific times to avoid, multiple attempts preferred, etc." className="bg-background min-h-[100px]" />
              </div>
            </div>
          </motion.div>

          {/* Section 3 — Document Upload */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">3</span>
              <h2 className="font-heading text-xl font-semibold text-foreground">Document Upload</h2>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-xl p-10 cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground text-sm">Click to upload documents</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG — max 25MB per file</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[300px]">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors ml-4 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4"
          >
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              By continuing, you confirm all information is accurate. You'll complete payment on the next step.
            </p>
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

      {showPayment && pkg && (
        <PaymentMethodSelector pkg={pkg} onClose={() => setShowPayment(false)} />
      )}

      <Footer />
    </div>
  );
}