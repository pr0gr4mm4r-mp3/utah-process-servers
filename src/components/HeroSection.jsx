import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a299aad37fb205f9d6f40a2/a5289b98a_generated_eff1b394.png"
          alt="Utah State Capitol building at golden hour, architectural photography"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1C1E]/90 via-[#1A1C1E]/70 to-[#1A1C1E]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-32 pb-20 lg:pt-0 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 bg-[#C4A265] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/70 tracking-widest uppercase">
                Licensed &amp; Bonded in Utah
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight">
              Precision in Service.{" "}
              <span className="italic text-[#C4A265]">Authority</span>{" "}
              in Utah.
            </h1>

            <p className="mt-8 text-lg text-white/60 max-w-lg leading-relaxed font-light">
              Utah's premier process serving firm. We deliver legal documents with
              the accuracy, speed, and compliance your case demands — throughout the Salt Lake Valley.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a href="#contact">
                <Button className="bg-[#C4A265] text-[#1A1C1E] hover:bg-[#C4A265]/90 font-semibold text-base px-8 py-6 tracking-wide">
                  Request Service
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="tel:+18015555555">
                <Button
                  variant="outline"
                  className="border-white/25 text-white hover:bg-white/10 font-medium text-base px-8 py-6 bg-transparent"
                >
                  Call Now
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right — quick action card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <p className="text-xs tracking-widest uppercase text-white/50 mb-6 font-medium">
                Quick Service Overview
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: Shield,
                    title: "Rule 4 Compliant",
                    desc: "Every service follows Utah Rules of Civil Procedure",
                  },
                  {
                    icon: Clock,
                    title: "Same-Day Service Available",
                    desc: "Rush and same-day options for urgent filings",
                  },
                  {
                    icon: MapPin,
                    title: "Salt Lake Valley",
                    desc: "Complete coverage across all Salt Lake County cities",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#C4A265]/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#C4A265]" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{item.title}</p>
                      <p className="text-white/45 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#contact" className="block mt-6">
                <Button className="w-full bg-white text-[#1A1C1E] hover:bg-white/90 font-semibold py-5">
                  Start Your Service Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom stat bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#1A1C1E]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15,000+", label: "Documents Served" },
              { value: "99.4%", label: "Success Rate" },
              { value: "SLV", label: "Salt Lake Valley" },
              { value: "24hr", label: "Avg. Turnaround" },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <p className="font-heading text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/45 mt-1 tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}