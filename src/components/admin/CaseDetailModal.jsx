import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ExternalLink, Save, Calendar } from "lucide-react";
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

export default function CaseDetailModal({ caseData, onClose, onUpdate }) {
  const [status, setStatus] = useState(caseData.status || "pending");
  const [notes, setNotes] = useState(caseData.notes || "");
  const [deliveredAt, setDeliveredAt] = useState(
    caseData.delivered_at ? caseData.delivered_at.slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.Case.update(caseData.id, {
      status,
      notes,
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
                    <a
                      key={i}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-2.5 hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{doc.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

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

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-primary gap-2">
                {saving ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}