import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X, Plus, MapPin, Trash2 } from "lucide-react";
import { FEATURED_PACKAGES } from "@/lib/packages";

const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default function CaseBlock({ index, data, onChange, onRemove, canRemove }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter((f) => f.size <= 25 * 1024 * 1024);
    const invalid = selected.filter((f) => f.size > 25 * 1024 * 1024);
    if (invalid.length > 0) {
      // soft warning without breaking the flow
      console.warn("Some files exceeded 25MB and were excluded.");
    }
    set("files", [...(data.files || []), ...valid.map((f) => ({ file: f, name: f.name, size: f.size }))]);
  };

  const removeFile = (i) => set("files", (data.files || []).filter((_, idx) => idx !== i));

  const addAddress = () => set("additionalAddresses", [...(data.additionalAddresses || []), ""]);
  const updateAddress = (i, v) =>
    set("additionalAddresses", (data.additionalAddresses || []).map((a, idx) => (idx === i ? v : a)));
  const removeAddress = (i) =>
    set("additionalAddresses", (data.additionalAddresses || []).filter((_, idx) => idx !== i));

  return (
    <div className="border border-border rounded-xl bg-muted/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <h3 className="font-heading text-lg font-semibold text-foreground">Case {index + 1}</h3>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors inline-flex items-center gap-1.5 text-sm"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </button>
        )}
      </div>

      {/* Package + case number */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Service Package *</label>
          <Select value={data.packageId} onValueChange={(v) => set("packageId", v)}>
            <SelectTrigger className="bg-background" type="button">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURED_PACKAGES.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — ${parseInt(p.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Case / File Number</label>
          <Input
            value={data.caseNumber || ""}
            onChange={(e) => set("caseNumber", e.target.value)}
            placeholder="e.g. 2024-CV-001234"
            className="bg-background"
          />
        </div>
      </div>

      {/* Plaintiff + respondent */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Plaintiff / Petitioner *</label>
          <Input
            required
            value={data.plaintiff || ""}
            onChange={(e) => set("plaintiff", e.target.value)}
            placeholder="Full legal name of plaintiff or petitioner"
            className="bg-background"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Respondent / Defendant *</label>
          <Input
            required
            value={data.respondentName || ""}
            onChange={(e) => set("respondentName", e.target.value)}
            placeholder="Full legal name"
            className="bg-background"
          />
        </div>
      </div>

      {/* Known address */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Address for Service <span className="text-muted-foreground font-normal">(where the respondent can be found)</span>
        </label>
        <Input
          value={data.respondentAddress || ""}
          onChange={(e) => set("respondentAddress", e.target.value)}
          placeholder="Respondent's address — Street, City, State, ZIP"
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Enter the address of the person being served — not your own address.
        </p>
      </div>

      {/* Additional addresses */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Additional Addresses for Service</label>
          <button
            type="button"
            onClick={addAddress}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add another address
          </button>
        </div>
        {(data.additionalAddresses || []).length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Add more addresses if the respondent may be found at multiple locations. Each address is charged at the full package price.
          </p>
        ) : (
          <div className="space-y-2">
            {(data.additionalAddresses || []).map((addr, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={addr}
                    onChange={(e) => updateAddress(i, e.target.value)}
                    placeholder="Street, City, State, ZIP"
                    className="bg-background"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAddress(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employer info */}
      <div className="border-t border-border pt-6">
        <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold mb-4">
          Respondent Employment Information <span className="normal-case font-normal">(optional)</span>
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Company / Employer Name</label>
            <Input
              value={data.respondentEmployer || ""}
              onChange={(e) => set("respondentEmployer", e.target.value)}
              placeholder="Employer or company name"
              className="bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Work Address</label>
            <Input
              value={data.respondentEmployerAddress || ""}
              onChange={(e) => set("respondentEmployerAddress", e.target.value)}
              placeholder="Street, City, State, ZIP"
              className="bg-background"
            />
          </div>
        </div>
      </div>

      {/* Special instructions */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Special Instructions</label>
        <Textarea
          value={data.specialInstructions || ""}
          onChange={(e) => set("specialInstructions", e.target.value)}
          placeholder="Gated community, specific times to avoid, etc."
          className="bg-background min-h-[90px]"
        />
      </div>

      {/* Documents */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Documents</label>
        <label
          htmlFor={`file-upload-${data.id}`}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/40 transition-all"
        >
          <Upload className="w-5 h-5 text-primary" />
          <div className="text-center">
            <p className="font-medium text-foreground text-sm">Click to upload documents</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG — max 25MB</p>
          </div>
          <input
            id={`file-upload-${data.id}`}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
        {(data.files || []).length > 0 && (
          <div className="mt-3 space-y-2">
            {(data.files || []).map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[260px]">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-4 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}