import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A1C1E] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4A265]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C4A265]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-6">
              Ready to Get Started?
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
              Your Documents Served with{" "}
              <span className="italic text-[#C4A265]">Precision</span> and{" "}
              <span className="italic text-[#C4A265]">Authority</span>
            </h2>
            <p className="mt-6 text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
              Join hundreds of Utah law firms and legal professionals who trust
              us for reliable, court-compliant process service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a href="#contact">
                <Button className="bg-[#C4A265] text-[#1A1C1E] hover:bg-[#C4A265]/90 font-semibold text-base px-8 py-6 tracking-wide">
                  Request Service Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="tel:+18015555555">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-medium text-base px-8 py-6 bg-transparent"
                >
                  Call (801) 555-5555
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}