import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddressCompletionSection({ caseData, onUpdate, onLogChange }) {
  const [toggling, setToggling] = useState(null);

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

  const served = caseData.served_addresses || [];
  const isServed = (key) => served.includes(key);
  const servedCount = addresses.filter((a) => isServed(a.key)).length;
  const allServed = addresses.length > 0 && servedCount === addresses.length;

  const toggleAddress = async (addr) => {
    if (toggling) return;
    setToggling(addr.key);
    try {
      const currentServed = caseData.served_addresses || [];
      let newServed;
      let marking;
      if (currentServed.includes(addr.key)) {
        newServed = currentServed.filter((k) => k !== addr.key);
        marking = false;
      } else {
        newServed = [...currentServed, addr.key];
        marking = true;
      }

      const updated = await base44.entities.Case.update(caseData.id, {
        served_addresses: newServed,
      });

      await base44.entities.StatusLog.create({
        case_id: caseData.id,
        event_type: "address_served",
        respondent_name: addr.label,
        note: `${marking ? "Service completed" : "Service unmarked"} — ${addr.address}`,
      });

      // Send the same completion notification as a whole-case Served update.
      // sendClientEmail delivers to the client AND CCs the office.
      if (marking && caseData.email) {
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
      toast.success(
        marking
          ? `Address marked as served — client & office notified`
          : `Address unmarked — ${addr.address}`
      );
    } catch {
      toast.error("Failed to update address status. Please try again.");
    } finally {
      setToggling(null);
    }
  };

  if (addresses.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
          Address Completion
        </p>
        <span className={`text-xs font-medium ${allServed ? "text-green-600" : "text-muted-foreground"}`}>
          {servedCount} of {addresses.length} served
        </span>
      </div>
      <div className="space-y-2">
        {addresses.map((addr) => {
          const done = isServed(addr.key);
          return (
            <div
              key={addr.key}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                done ? "border-green-200 bg-green-50" : "border-border bg-muted/30"
              }`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${done ? "text-green-600" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{addr.address}</p>
                <p className="text-xs text-muted-foreground truncate">{addr.label}</p>
              </div>
              <button
                onClick={() => toggleAddress(addr)}
                disabled={toggling === addr.key}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 disabled:opacity-50 ${
                  done
                    ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {toggling === addr.key ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : done ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Served
                  </>
                ) : (
                  "Mark Served"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}