import React from "react";
import { ChevronRight, FileText, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { calculateCaseTotal } from "@/lib/caseUtils";

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  pending_proof: "bg-purple-50 text-purple-700 border-purple-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  delivered: "Served",
  pending_proof: "Pending Proof",
  failed: "Failed",
};

export default function CaseRow({ caseData: c, onClick }) {
  const submittedDate = c.submitted_at || c.created_date;

  const paymentMethodLabel = {
    stripe: "Card",
    paypal: "PayPal",
    zelle: "Zelle",
    venmo: "Venmo",
    base44: "Card",
    other: "Other",
  };

  return (
    <button
      onClick={onClick}
      className="w-full grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/20 transition-colors text-left items-center"
    >
      <span className="text-sm font-mono text-foreground truncate">
        {c.case_number || <span className="text-muted-foreground italic">—</span>}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{c.attorney}</p>
        <p className="text-xs text-muted-foreground truncate">
          {c.respondent_name}
          {c.additional_respondents?.length > 0 && (
            <span className="text-primary/70"> +{c.additional_respondents.length} more</span>
          )}
        </p>
      </div>
      <span className="text-sm text-foreground truncate">{c.service_type}</span>
      <span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[c.status] || STATUS_STYLES.pending}`}>
          {STATUS_LABELS[c.status] || "Pending"}
        </span>
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">
          ${calculateCaseTotal(c).toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">
          {c.payment_method ? paymentMethodLabel[c.payment_method] || c.payment_method : "—"}
          {c.payment_received ? " · Paid" : " · Pending"}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {submittedDate ? format(new Date(submittedDate), "MMM d, yyyy") : "—"}
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}