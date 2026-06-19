import React from "react";
import { motion } from "framer-motion";

const cities = [
  "Salt Lake City", "West Valley City", "Murray", "Millcreek",
  "Holladay", "Cottonwood Heights", "Sandy", "South Jordan",
  "West Jordan", "Midvale", "Taylorsville", "Kearns",
  "Herriman", "Riverton", "Draper", "Bluffdale",
  "South Salt Lake", "Magna", "Copperton",
];

export default function CoverageSection() {
  return (
    <section id="coverage" className="py-24 md:py-36 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a299aad37fb205f9d6f40a2/66d1d617c_generated_2069730a.png"
          alt="Aerial view of the Salt Lake Valley — Utah Process Servers coverage area"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1E]/85 via-[#1A1C1E]/90 to-[#1A1C1E]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-[#C4A265] font-semibold mb-4">
            Service Area
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            The Salt Lake Valley — Fully Covered.
          </h2>
          <p className="mt-6 text-white/55 text-lg leading-relaxed">
            We serve every city, municipality, and unincorporated area within
            Salt Lake County with same-day and rush options available.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-4">
          {cities.map((city, i) => (
            <motion.div
              key={city}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center gap-2 group"
            >
              <div className="w-1 h-1 rounded-full bg-[#C4A265]/50 group-hover:bg-[#C4A265] transition-colors" />
              <span className="text-sm text-white/60 group-hover:text-white transition-colors font-medium">
                {city}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-white/10"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Salt Lake City & Urban Core",
                desc: "Downtown SLC, South Salt Lake, Murray — priority same-day service",
              },
              {
                title: "South Valley",
                desc: "Sandy, Draper, South Jordan, Riverton, Herriman — full coverage",
              },
              {
                title: "West Valley & Suburbs",
                desc: "West Valley City, Taylorsville, Kearns, Magna — rapid turnaround",
              },
            ].map((region) => (
              <div
                key={region.title}
                className="p-6 rounded-xl border border-white/8 bg-white/[0.03]"
              >
                <h3 className="font-heading text-lg font-semibold text-white mb-2">
                  {region.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {region.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}