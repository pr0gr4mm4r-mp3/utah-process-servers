import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Check, X, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Helper: read per-address result from address_results (new) or served_addresses (legacy)
function getResult(caseData, key) {
  const results = caseData.address_results || [];
  const found = results.find((r) => r.key === key);
  if (found) return found;
  // Legacy: treat served_addresses keys as served with no timestamp
  const served = caseData.served_addresses || [];
  if (served.includes(key)) return { key, status: "served", served_at: null };
  return null;
}

export default function AddressCompletionSection({ caseData, onUpdate, onLogChange }) {
  const [busy, setBusy] = useState(null);
  const [editingTime, setEditingTime] = useState(null);
  const [timeDraft, setTimeDraft] = useState("");

  // Collect every address on the case with a stable key
  const addresses = [];
  if (caseData.respondent_address && caseData.respondent_address.trim()) {
    addresses.push({
      key: "primary",
      label: caseData.respondent_name || "Primary Respondent",
      address: caseData.respondent_address,
    });
  }
  (caseData.additional_addresses || []).forEach((addr, i) => {
    if (addr && addr.trim()) {
      addresses.push({
        key: `additional-${i}`,
        label: caseData.respondent_name || "Primary Respondent",
        address: addr,
      });
    }
  });
  (caseData.additional_respondents || []).forEach((r, i) => {
    if (r.address && r.address.trim()) {
      addresses.push({
        key: `respondent-${i}`,
        label: r.name || `Additional Respondent ${i + 1}`,
        address: r.address,
      });
    }
  });

  const results = caseData.address_results || [];
  const getStatus = (key) => getResult(caseData, key)?.status || "pending";
  const getServedAt = (key) => getResult(caseData, key)?.served_at || null;

  const servedCount = addresses.filter((a) => getStatus(a.key) === "served").length;
  const failedCount = addresses.filter((a) => getStatus(a.key) === "failed").length;
  const resolvedCount = servedCount + failedCount;

  // Build the new address_results array with one entry per address that has a result
  const buildResults = (key, status, servedAt) => {
    const existing = (caseData.address_results || []).filter((r) => r.key !== key);
    if (status === "pending") return existing; // remove entry = reset to pending
    return [...existing, { key, status, served_at: servedAt || null }];
  };

  // Keep served_addresses in sync for backward compat (only served keys)
  const buildServedAddresses = (results) =>
    results.filter((r) => r.status === "served").map((r) => r.key);

  const persist = async (key, status, servedAt) => {
    const newResults = buildResults(key, status, servedAt);
    const newServed = buildServedAddresses(newResults);
    const updated = await base44.entities.Case.update(caseData.id, {
      address_results: newResults,
      served_addresses: newServed,
    });
    return updated;
  };

  const markServed = async (addr) => {
    if (busy) return;
    setBusy(addr.key);
    try {
      const now = new Date().toISOString();
      const updated = await persist(addr.key, "served", now);

      await base44.entities.StatusLog.create({
        case_id: caseData.id,
        event_type: "address_served",
        respondent_name: addr.label,
        note: `Service completed — ${addr.address}`,
      });

      if (caseData.email) {
        base44.functions
          .invoke("sendClientEmail", {
            to: caseData.email,
            subject: `Service Complete — Documents Served${caseData.case_number ? ` — Case #${caseData.case_number}` : ""}`,
            body: `Dear ${caseData.attorney || "Valued Client"},

Your documents have been successfully served at the following address:

${addr.address}

A proof of service will be provided to you.

Case Details:
- Case Number: ${caseData.case_number || "N/A"}
- Service Type: ${caseData.service_type}
- Respondent: ${addr.label}

If you have any questions, please call us at (801) 755-5445 or email utahproservers@yahoo.com.

Utah Process Servers
Licensed & Bonded in Utah`.trim(),
          })
          .catch(() => {});
      }

      onUpdate(updated);
      onLogChange();
      toast.success("Address marked as served — client & office notified");
    } catch {
      toast.error("Failed to update address status. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const markFailed = async (addr) => {
    if (busy) return;
    setBusy(addr.key);
    try {
      const updated = await persist(addr.key, "failed", null);

      await base44.entities.StatusLog.create({
        case_id: caseData.id,
        event_type: "status_change",
        status: "failed",
        respondent_name: addr.label,
        note: `Service failed at address — ${addr.address}`,
      });

      onUpdate(updated);
      onLogChange();
      toast.success("Address marked as failed");
    } catch {
      toast.error("Failed to update address status. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const reset = async (addr) => {
    if (busy) return;
    setBusy(addr.key);
    try {
      const updated = await persist(addr.key, "pending", null);
      onUpdate(updated);
      onLogChange();
      toast.success("Address reset to pending");
    } catch {
      toast.error("Failed to reset address. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const saveServedAt = async (addr) => {
    if (busy) return;
    setBusy(addr.key);
    try {
      const iso = timeDraft ? new Date(timeDraft).toISOString() : null;
      const updated = await persist(addr.key, "served", iso);
      setEditingTime(null);
      onUpdate(updated);
      toast.success("Served-at time updated");
    } catch {
      toast.error("Failed to update served-at time.");
    } finally {
      setBusy(null);
    }
  };

  if (addresses.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
          Address Completion
        </p>
        <span className="text-xs font-medium text-muted-foreground">
          {servedCount} served · {failedCount} failed · {addresses.length - resolvedCount} pending
        </span>
      </div>
      <div className="space-y-2">
        {addresses.map((addr) => {
          const status = getStatus(addr.key);
          const servedAt = getServedAt(addr.key);
          const isBusy = busy === addr.key;
          return (
            <div
              key={addr.key}
              className={`rounded-xl border px-4 py-3 transition-colors ${
                status === "served"
                  ? "border-green-200 bg-green-50"
                  : status === "failed"
                  ? "border-red-200 bg-red-50"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin
                  className={`w-4 h-4 flex-shrink-0 ${
                    status === "served"
                      ? "text-green-600"
                      : status === "failed"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{addr.address}</p>
                  <p className="text-xs text-muted-foreground truncate">{addr.label}</p>
                </div>

                {/* Status badge */}
                {status !== "pending" && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      status === "served"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status === "served" ? "Served" : "Failed"}
                  </span>
                )}
              </div>

              {/* Served-at row */}
              {status === "served" && (
                <div className="flex items-center gap-2 mt-2 pl-7">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  {editingTime === addr.key ? (
                    <>
                      <input
                        type="datetime-local"
                        value={timeDraft}
                        onChange={(e) => setTimeDraft(e.target.value)}
                        className="text-xs border border-border rounded-md px-2 py-1 bg-background flex-1"
                      />
                      <button
                        onClick={() => saveServedAt(addr)}
                        disabled={isBusy}
                        className="text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingTime(null)}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground">
                        {servedAt
                          ? format(new Date(servedAt), "MMM d, yyyy — h:mm a")
                          : "No timestamp set"}
                      </span>
                      <button
                        onClick={() => {
                          setEditingTime(addr.key);
                          setTimeDraft(servedAt ? new Date(servedAt).toISOString().slice(0, 16) : "");
                        }}
                        className="text-xs font-medium text-primary hover:text-primary/80"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-2 pl-7">
                {status === "pending" ? (
                  <>
                    <button
                      onClick={() => markServed(addr)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Mark Served
                    </button>
                    <button
                      onClick={() => markFailed(addr)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      Mark Failed
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => reset(addr)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50"
                  >
                    {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                    Reset
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}