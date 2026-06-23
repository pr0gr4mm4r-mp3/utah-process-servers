import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, Printer, Save, Calendar, Trash2, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700",
  in_progress: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

const PAYMENT_METHOD_LABELS = {
  stripe: "Credit / Debit Card (Stripe)",
  paypal: "PayPal",
  zelle: "Zelle",
  venmo: "Venmo",
  base44: "Base44 Payments",
  other: "Other",
};

export default function CaseDetailModal({ caseData, onClose, onUpdate }) {
  const [status, setStatus] = useState(caseData.status || "pending");
  const [notes, setNotes] = useState(caseData.notes || "");
  const [deliveredAt, setDeliveredAt] = useState(
    caseData.delivered_at ? caseData.delivered_at.slice(0, 16) : ""
  );
  const [paymentReceived, setPaymentReceived] = useState(caseData.payment_received || false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this case? This cannot be undone.")) return;
    setDeleting(true);
    await base44.entities.Case.delete(caseData.id);
    toast.success("Case deleted");
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.Case.update(caseData.id, {
      status,
      notes,
      payment_received: paymentReceived,
      payment_status: paymentReceived ? "paid" : "pending",
      delivered_at: deliveredAt ? new Date(deliveredAt).toISOString() : null,
    });
    onUpdate(updated);
    toast.success("Case updated successfully");
    setSaving(false);
  };

  const submittedDate = caseData.submitted_at || caseData.created_date;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-[#1A1C1E] text-white p-6 rounded-t-2xl flex items-start justify-between">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[#C4A265] font-semibold mb-1">
                Case Details
              </p>
              <h2 className="font-heading text-xl font-bold">
                {caseData.case_number || "No Case Number"}
              </h2>
              <p className="text-white/50 text-sm mt-1">{caseData.respondent_name}</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Client info */}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Client Information</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Attorney", caseData.attorney],
                  ["Firm", caseData.firm || "—"],
                  ["Email", caseData.email],
                  ["Phone", caseData.phone || "—"],
                  ["Service Type", caseData.service_type],
                  ["County", caseData.county ? `${caseData.county} County` : "—"],
                  ["Respondent", caseData.respondent_name],
                  ["Address", caseData.respondent_address || "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
                    <p className="font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              {caseData.special_instructions && (
                <div className="mt-3">
                  <p className="text-muted-foreground text-xs mb-0.5">Special Instructions</p>
                  <p className="text-sm text-foreground bg-muted/40 rounded-lg p-3">{caseData.special_instructions}</p>
                </div>
              )}
            </div>

            {/* Dates */}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Dates</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Submitted</p>
                  <p className="font-medium">
                    {submittedDate ? format(new Date(submittedDate), "MMM d, yyyy — h:mm a") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Delivered At</p>
                  <input
                    type="datetime-local"
                    value={deliveredAt}
                    onChange={(e) => setDeliveredAt(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-1.5 w-full bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            {caseData.document_urls?.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">
                  Documents ({caseData.document_urls.length})
                </p>
                <div className="space-y-2">
                  {caseData.document_urls.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground truncate">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                        <a
                          href={doc.url}
                          download={doc.name}
                          title="Download"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          title="Print"
                          onClick={() => {
                            const win = window.open(doc.url, "_blank");
                            win.onload = () => win.print();
                          }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment info */}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Payment</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Method</p>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                    {PAYMENT_METHOD_LABELS[caseData.payment_method] || "—"}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Amount</p>
                  <p className="font-medium text-foreground">
                    {caseData.package_price ? `$${parseFloat(caseData.package_price).toFixed(2)}` : "—"}
                    {caseData.package_name ? <span className="text-muted-foreground text-xs ml-1">({caseData.package_name})</span> : null}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Payment Received</span>
                  {paymentReceived && (
                    <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">Verified</span>
                  )}
                  {!paymentReceived && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">Pending</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentReceived(!paymentReceived)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    paymentReceived ? "bg-green-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      paymentReceived ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Status + notes */}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Update Status</p>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mb-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Internal Notes</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes, attempt history, affidavit details..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-2">
                {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Case
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-primary gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}