import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackageSelection from "@/components/PackageSelection";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-[#1A1C1E] pt-28 pb-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-white leading-tight">
            Service & Pricing
          </h1>
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