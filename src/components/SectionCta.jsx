import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SectionCta({ label = "Request Service", className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex justify-center mt-14 ${className}`}
    >
      <Link to="/pricing">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 py-6 tracking-wide">
          {label}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}