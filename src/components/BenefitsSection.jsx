import React from "react";
import { motion } from "framer-motion";

const benefits = [
  {
    number: "01",
    title: "Timestamped Proof of Service",
    description:
      "Every service attempt is documented with precise time stamps, detailed field notes, and photographic evidence where applicable. Our digital affidavits provide irrefutable proof that withstands court scrutiny.",
    detail: "Full chain-of-custody documentation included with every service.",
  },
  {
    number: "02",
    title: "Full Rule 4 Compliance",
    description:
      "Every document is served in strict accordance with the Utah Rules of Civil Procedure. We understand the nuances of personal service, substitute service, and service by publication.",
    detail: "Zero compliance failures. Every server is trained and tested on current Utah statutes.",
  },
  {
    number: "03",
    title: "Transparent, Real-Time Status Updates",
    description:
      "Track your service from assignment to completion through our secure client portal. Receive instant notifications at every milestone — no more calling to check status.",
    detail: "Email and SMS notifications. Full attempt history and affidavit downloads available 24/7.",
  },
  {
    number: "04",
    title: "Salt Lake Valley Coverage, Local Expertise",
    description:
      "We maintain deep knowledge of every neighborhood, courthouse, and jurisdiction across the Salt Lake Valley. No surprises, no delays — just reliable service from people who know the area.",
    detail: "All of Salt Lake County. Dedicated servers throughout the valley.",
  },
  {
    number: "05",
    title: "Rush & Same-Day Service",
    description:
      "Time-sensitive matters demand immediate action. Our priority service guarantees first attempt within 24 hours. Same-day service available in the Wasatch Front.",
    detail: "Same-day available M-F before 2pm. Weekend and holiday service upon request.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 md:py-36 bg-muted/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
            Why Choose Us
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Built on Proof, Not Promises
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Every advantage is designed to protect your case, save your time, and
            deliver results you can present in court with confidence.
          </p>
        </motion.div>

        <div className="space-y-0 border-t border-border">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="grid md:grid-cols-12 gap-6 md:gap-12 py-10 md:py-14 border-b border-border group"
            >
              <div className="md:col-span-1">
                <span className="font-heading text-3xl md:text-4xl font-bold text-primary/30 group-hover:text-primary transition-colors duration-300">
                  {benefit.number}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-snug">
                  {benefit.title}
                </h3>
              </div>
              <div className="md:col-span-7">
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
                <p className="mt-4 text-sm text-primary/70 font-medium border-l-2 border-primary/25 pl-4">
                  {benefit.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}