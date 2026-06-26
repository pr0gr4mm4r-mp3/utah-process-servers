import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Your request has been submitted. We'll contact you within 1 business hour.");
    setFormData({ name: "", email: "", phone: "", serviceType: "", message: "" });
    setSending(false);
  };

  return (
    <section id="contact" className="py-24 md:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
              Get Started
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Request Service Today
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Submit your service request and one of our coordinators will
              respond within one business hour with a quote and timeline.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { icon: Phone, label: "(801) 755-5445", sub: "Mon–Sat, 7AM–9PM" },
                { icon: Mail, label: "contact@utahproservers.com", sub: "Secure email" },
                { icon: MapPin, label: "4448 Loren Von Dr., Millcreek, UT 84124", sub: "Serving the Salt Lake Valley" },
                { icon: Clock, label: "Available 24 Hours, 7 Days a Week", sub: "Around-the-clock response for urgent matters" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-muted/40 border border-border rounded-2xl p-8 lg:p-10 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email *
                  </label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@firm.com"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(801) 000-0000"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Service Type *
                  </label>
                  <Select
                    required
                    value={formData.serviceType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, serviceType: val })
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Service</SelectItem>
                      <SelectItem value="rush">Rush Service (24hr)</SelectItem>
                      <SelectItem value="same-day">Same-Day Service</SelectItem>
                      <SelectItem value="skip-trace">Skip Tracing</SelectItem>
                      <SelectItem value="court-filing">Court Filing</SelectItem>
                      <SelectItem value="eviction">Eviction Notice</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Details
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Briefly describe your service needs, including city/area and any time constraints..."
                  className="bg-background min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 text-base tracking-wide"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Service Request
                  </span>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                All information is kept strictly confidential. We respond within 1 business hour.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}