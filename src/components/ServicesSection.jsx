import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, Building2, Scale, Gavel, Search } from "lucide-react";
import SectionCta from "@/components/SectionCta";

const services = [
  {
    icon: FileText,
    title: "Standard Process Service",
    description:
      "Personal service of summons, complaints, subpoenas, and all civil documents in compliance with Utah Rule 4.",
  },
  {
    icon: Users,
    title: "Substitute Service",
    description:
      "When personal service proves impractical, we execute lawful substitute service per court-approved methods.",
  },
  {
    icon: Building2,
    title: "Corporate & Registered Agent",
    description:
      "Service upon businesses, registered agents, and government entities with proper chain-of-custody documentation.",
  },
  {
    icon: Scale,
    title: "Court Filings",
    description:
      "Document filing at all Utah district courts, small claims courts, and the Utah Court of Appeals.",
  },
  {
    icon: Gavel,
    title: "Eviction Notices",
    description:
      "Timely service of 3-day, 15-day, and other eviction notices in compliance with Utah landlord-tenant law.",
  },
  {
    icon: Search,
    title: "Skip Tracing",
    description:
      "Locate hard-to-find recipients through advanced skip tracing techniques, ensuring successful service of your legal documents.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
            Our Services
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Salt Lake Valley Process Serving & Legal Document Services
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            From routine civil process to complex skip traces, we handle every aspect of legal document delivery across Salt Lake City, Millcreek, Sandy, West Valley, and all of Salt Lake County.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px mt-20 bg-border rounded-2xl overflow-hidden border border-border">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background p-8 lg:p-10 group hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <service.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <SectionCta />
      </div>
    </section>
  );
}