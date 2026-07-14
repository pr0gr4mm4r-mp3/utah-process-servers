import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { motion } from "framer-motion";

const PACKAGES = [
  {
    id: "standard",
    name: "Standard Service",
    price: "80.00",
    turnaround: "Up to 3 days",
    description: "Three documented service attempts over three consecutive days, with certified proof of service upon completion.",
    features: ["Three attempts over three days", "Certified proof of service", "Email confirmation"],
    serviceType: "Standard Service",
  },
  {
    id: "rush",
    name: "Rush Service",
    price: "160.00",
    turnaround: "24 hours",
    description: "Priority handling for time-sensitive legal deadlines",
    features: ["24-hour turnaround", "Real-time status updates", "Priority server assignment"],
    serviceType: "Rush Service",
    popular: true,
  },
  {
    id: "same_day",
    name: "Same-Day Service",
    price: "250.00",
    turnaround: "Same day",
    description: "Urgent same-day service for critical filings",
    features: ["Same-day completion", "Dedicated process server", "Immediate confirmation"],
    serviceType: "Same-Day Service",
  },
  {
    id: "substitute",
    name: "Substitute Service",
    price: "95.00",
    turnaround: "3–5 business days",
    description: "Court-authorized alternative service methods",
    serviceType: "Substitute Service",
  },
  {
    id: "corporate",
    name: "Corporate Service",
    price: "110.00",
    turnaround: "3–5 business days",
    description: "Service on registered agents and corporate entities",
    serviceType: "Corporate Service",
  },
  {
    id: "eviction",
    name: "Eviction Notice",
    price: "95.00",
    turnaround: "24–48 hours",
    description: "Eviction and unlawful detainer notice delivery",
    serviceType: "Eviction Notice",
  },
  {
    id: "subpoena",
    name: "Subpoena Service",
    price: "95.00",
    turnaround: "3–5 business days",
    description: "Civil and criminal subpoena service statewide",
    serviceType: "Subpoena Service",
  },
  {
    id: "court_filing",
    name: "Court Filing",
    price: "75.00",
    turnaround: "1–2 business days",
    description: "Document filing with Utah state and federal courts",
    serviceType: "Court Filing",
  },
  {
    id: "skip_tracing",
    name: "Skip Tracing",
    price: "59.00",
    turnaround: "1–3 business days",
    description: "Locate hard-to-find recipients for successful service",
    serviceType: "Skip Tracing",
  },
];

const FEATURED_IDS = ["standard", "rush", "same_day"];

export default function PackageSelection() {
  const featured = PACKAGES.filter(p => FEATURED_IDS.includes(p.id));
  const additional = PACKAGES.filter(p => !FEATURED_IDS.includes(p.id));

  const handleSelect = (pkg) => {
    // Pricing-first flow: save the selected package, then submit documents
    localStorage.setItem("ups_package", JSON.stringify({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      serviceType: pkg.serviceType,
      turnaround: pkg.turnaround,
    }));
    window.location.href = "/submit";
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">Service Packages</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Select Your Service</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All packages include certified proof of service and court-admissible documentation.
          </p>
        </div>

        {/* Featured tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {featured.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border bg-white p-8 flex flex-col ${
                pkg.popular ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full tracking-wide uppercase">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                <Clock className="w-3.5 h-3.5" />
                {pkg.turnaround}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-foreground">${parseInt(pkg.price)}</span>
                <span className="text-muted-foreground text-sm">.{pkg.price.split(".")[1]}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelect(pkg)}
                className={`w-full py-5 font-semibold ${pkg.popular ? "bg-primary text-primary-foreground" : ""}`}
                variant={pkg.popular ? "default" : "outline"}
              >
                Continue
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Additional services */}
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-6 text-center">Additional Services</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additional.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="border border-border rounded-xl bg-white p-6 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h4 className="font-medium text-foreground">{pkg.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {pkg.turnaround}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{pkg.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-bold text-lg text-foreground">${parseInt(pkg.price)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelect(pkg)}
                  >
                    Select
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}