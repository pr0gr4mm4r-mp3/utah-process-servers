import React from "react";
import { motion } from "framer-motion";
import { Upload, MapPin, Zap, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "Step 01",
    title: "Submit Your Documents",
    description:
      "Send us your documents via our secure portal, email, or fax. Include the subject's name, last known address, and any relevant case information.",
  },
  {
    icon: MapPin,
    step: "Step 02",
    title: "We Locate & Serve",
    description:
      "Our experienced servers locate the subject and execute service in compliance with Utah Rules of Civil Procedure. GPS verification on every attempt.",
  },
  {
    icon: Zap,
    step: "Step 03",
    title: "Real-Time Updates",
    description:
      "Track progress through our client portal. Receive instant notifications on every attempt, including time, location, and outcome details.",
  },
  {
    icon: CheckCircle,
    step: "Step 04",
    title: "Proof of Service Delivered",
    description:
      "Receive your completed affidavit of service with GPS verification, ready for court filing. Digital and physical copies available.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-36 bg-background relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — image & intro */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
              How It Works
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Four Steps to Completed Service
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              We've streamlined the process serving workflow to be as
              frictionless as possible — so you can focus on your case while we
              handle the delivery.
            </p>

            <div className="mt-12 rounded-2xl overflow-hidden border border-border">
              <img
                src="https://media.base44.com/images/public/6a299aad37fb205f9d6f40a2/6d4f6ca29_generated_0e178915.png"
                alt="Legal documents and fountain pen on warm paper texture"
                className="w-full h-64 object-cover"
              />
            </div>
          </motion.div>

          {/* Right — steps */}
          <div className="space-y-0">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 py-8 border-b border-border last:border-b-0 group"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-primary font-semibold mb-2">
                    {item.step}
                  </p>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}