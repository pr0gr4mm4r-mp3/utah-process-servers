import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, Shield, MapPin } from "lucide-react";
import { PACKAGES, FEATURED_IDS } from "@/lib/packages";

export default function HeroSection() {
  const featured = PACKAGES.filter((p) => FEATURED_IDS.includes(p.id));

  const handleSelect = (pkg) => {
    localStorage.setItem(
      "ups_package",
      JSON.stringify({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        serviceType: pkg.serviceType,
        turnaround: pkg.turnaround,
      })
    );
    window.location.href = "/submit";
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a299aad37fb205f9d6f40a2/a5289b98a_generated_eff1b394.png"
          alt="Salt Lake Valley skyline — Utah Process Servers serving all of Salt Lake County"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1E]/92 via-[#1A1C1E]/85 to-[#1A1C1E]/96" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-28 pb-10 flex-1 flex flex-col">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 bg-[#C4A265] rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white/70 tracking-widest uppercase">
              Serving the Salt Lake Valley for Over 15 Years
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
            Salt Lake Valley's{" "}
            <span className="italic text-[#C4A265]">Trusted</span>{" "}
            Process Servers.
          </h1>

          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
            Rule 4 compliant service across all of Salt Lake County. Certified proof of service, court-admissible documentation, and same-day options available.
          </p>
        </motion.div>

        {/* Pricing cards — front and center */}
        <div id="pricing" className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto w-full scroll-mt-24">
          {featured.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                pkg.popular ? "order-first md:order-none " : ""
              }${
                pkg.popular
                  ? "bg-white/[0.10] backdrop-blur-xl border border-[#C4A265]/40 shadow-2xl ring-1 ring-[#C4A265]/25"
                  : "bg-white/[0.06] backdrop-blur-xl border border-white/10"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#C4A265] text-[#1A1C1E] text-xs font-bold px-4 py-1 rounded-full tracking-wide uppercase">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="font-heading text-xl font-bold text-white mb-1">{pkg.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-white/50 mb-5">
                <Clock className="w-3.5 h-3.5" />
                {pkg.turnaround}
              </div>

              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold text-white">${parseInt(pkg.price)}</span>
              </div>
              <p className="text-xs text-white/40 mb-4">+ 3.5% processing fee added at checkout</p>

              <p className="text-sm text-white/55 mb-6">{pkg.description}</p>

              <ul className="space-y-2.5 mb-7 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelect(pkg)}
                className={`w-full py-5 font-semibold gap-2 ${
                  pkg.popular
                    ? "bg-[#C4A265] text-[#1A1C1E] hover:bg-[#C4A265]/90"
                    : "bg-white text-[#1A1C1E] hover:bg-white/90"
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Processing fee disclosure */}
        <p className="text-xs text-white/35 text-center leading-relaxed max-w-3xl mx-auto mt-8">
          <strong className="text-white/45">Payment Processing Fee Disclosure:</strong> A 3.5% processing fee is added at checkout to all transactions to compensate for card processing costs. This fee is charged by our payment processor and is not retained by Utah Process Servers.
        </p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/50"
        >
          {[
            { icon: Shield, label: "Rule 4 Compliant" },
            { icon: Clock, label: "Same-Day Available" },
            { icon: MapPin, label: "All Salt Lake County" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <item.icon className="w-4 h-4 text-[#C4A265]" />
              {item.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom stat bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#1A1C1E]/60 backdrop-blur-md">
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