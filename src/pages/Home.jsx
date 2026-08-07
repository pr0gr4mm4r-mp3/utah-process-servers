import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProcessSection from "@/components/ProcessSection";
import CoverageSection from "@/components/CoverageSection";
import ContactSection from "@/components/ContactSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import PackageSelection from "@/components/PackageSelection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <section id="pricing">
        <PackageSelection />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-10">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Payment Processing Fee Disclosure:</strong> A 3.5% processing fee is added at checkout to all transactions to compensate for card processing costs. This fee is charged by our payment processor and is not retained by Utah Process Servers.
          </p>
        </div>
      </section>
      <ServicesSection />
      <BenefitsSection />
      <ProcessSection />
      <CoverageSection />
      <ContactSection />
      <CTABanner />
      <Footer />
    </div>
  );
}