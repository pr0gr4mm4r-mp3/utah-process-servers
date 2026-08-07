import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { PACKAGES, FEATURED_IDS } from "@/lib/packages";



export default function PackageSelection() {
  const featured = PACKAGES.filter(p => FEATURED_IDS.includes(p.id));

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
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-2">Service Packages</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Select Your Service</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
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
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold text-foreground">${parseInt(pkg.price)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">+ 3.5% processing fee added at checkout</p>
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


      </div>

    </div>
  );
}