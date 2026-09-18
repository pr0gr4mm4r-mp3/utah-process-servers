import React from "react";
import { Input } from "@/components/ui/input";

export default function ClientInfoSection({ value, onChange }) {
  const set = (field, v) => onChange({ ...value, [field]: v });

  return (
    <div className="grid sm:grid-cols-2 gap-6 bg-muted/30 border border-border rounded-xl p-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Attorney Name <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          value={value.attorneyName || ""}
          onChange={(e) => set("attorneyName", e.target.value)}
          placeholder="John Smith, Esq."
          className="bg-background"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Law Firm / Organization <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          value={value.firm || ""}
          onChange={(e) => set("firm", e.target.value)}
          placeholder="Smith & Associates"
          className="bg-background"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Point of Contact *</label>
        <Input
          required
          value={value.pointOfContact || ""}
          onChange={(e) => set("pointOfContact", e.target.value)}
          placeholder="Full name of person to contact"
          className="bg-background"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Email Address *</label>
        <Input
          required
          type="email"
          value={value.email || ""}
          onChange={(e) => set("email", e.target.value)}
          placeholder="attorney@firm.com"
          className="bg-background"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Phone Number *</label>
        <Input
          required
          type="tel"
          value={value.phone || ""}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="(801) 000-0000"
          className="bg-background"
        />
      </div>
    </div>
  );
}