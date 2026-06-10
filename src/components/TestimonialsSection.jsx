import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Utah Process Servers has been our go-to firm for over three years. Their GPS-verified affidavits have never been challenged in court. Exceptional reliability.",
    name: "Rachel M.",
    role: "Litigation Paralegal",
    firm: "Anderson & Cole, P.C.",
  },
  {
    quote:
      "We needed same-day service on a TRO in Davis County. They had proof of service back to us within four hours. That's the kind of urgency that wins cases.",
    name: "David L.",
    role: "Family Law Attorney",
    firm: "Wasatch Legal Group",
  },
  {
    quote:
      "Their skip tracing team located a defendant we'd been searching for over six months. Professional, discreet, and thorough. I won't use anyone else.",
    name: "Sarah K.",
    role: "Collections Manager",
    firm: "Intermountain Credit Services",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-36 bg-muted/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Trusted by Utah's Legal Community
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background border border-border rounded-2xl p-8 flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-foreground leading-relaxed flex-1 text-[15px]">
                "{t.quote}"
              </p>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-semibold text-foreground text-sm">
                  {t.name}
                </p>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {t.role}
                </p>
                <p className="text-muted-foreground/70 text-xs mt-0.5">
                  {t.firm}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}