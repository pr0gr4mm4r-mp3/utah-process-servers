import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageSelection from "@/components/PackageSelection";
import { Shield, Lock, FileText } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-[#1A1C1E] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-4">
            Professional Process Service
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            Service & Pricing
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Select your service package below to complete payment. If you haven't submitted your
            documents yet, you'll be prompted to do so first.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: Shield, label: "Licensed & Bonded" },
              { icon: Lock, label: "Secure Payments" },
              { icon: FileText, label: "Court-Admissible" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-white/40">
                <badge.icon className="w-4 h-4 text-[#C4A265]/60" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PackageSelection />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-10">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          <strong>Payment Processing Fee Disclosure:</strong> A 3.5% convenience fee will be added to all credit and debit card transactions. This fee is charged by our payment processor and is not retained by Utah Process Servers. To avoid this fee, payment may be made via Zelle or Venmo at no additional charge.
        </p>
      </div>

      <Footer />
    </div>
  );
}