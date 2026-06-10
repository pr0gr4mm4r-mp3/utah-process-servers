import React from "react";
import { motion } from "framer-motion";

const counties = [
  "Beaver", "Box Elder", "Cache", "Carbon", "Daggett",
  "Davis", "Duchesne", "Emery", "Garfield", "Grand",
  "Iron", "Juab", "Kane", "Millard", "Morgan",
  "Piute", "Rich", "Salt Lake", "San Juan", "Sanpete",
  "Sevier", "Summit", "Tooele", "Uintah", "Utah",
  "Wasatch", "Washington", "Wayne", "Weber",
];

export default function CoverageSection() {
  return (
    <section id="coverage" className="py-24 md:py-36 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a299aad37fb205f9d6f40a2/66d1d617c_generated_2069730a.png"
          alt="Aerial view of Utah Bonneville Salt Flats at dawn"
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
            All 29 Utah Counties. No Exceptions.
          </h2>
          <p className="mt-6 text-white/55 text-lg leading-relaxed">
            From the Wasatch Front to the Colorado Plateau, we maintain
            experienced servers in every judicial district across the state.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-4">
          {counties.map((county, i) => (
            <motion.div
              key={county}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="flex items-center gap-2 group"
            >
              <div className="w-1 h-1 rounded-full bg-[#C4A265]/50 group-hover:bg-[#C4A265] transition-colors" />
              <span className="text-sm text-white/60 group-hover:text-white transition-colors font-medium">
                {county} County
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
                title: "Wasatch Front",
                desc: "Salt Lake, Davis, Utah, Weber — same-day service available",
              },
              {
                title: "Southern Utah",
                desc: "Washington, Iron, Kane, Garfield — dedicated regional servers",
              },
              {
                title: "Rural & Remote",
                desc: "All remaining counties serviced within standard timelines",
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