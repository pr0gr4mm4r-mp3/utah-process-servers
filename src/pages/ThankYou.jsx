import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ThankYou() {
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("ups_checkout");
    if (stored) {
      setCheckoutInfo(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Payment Confirmed
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Your payment has been received. Please proceed to submit your documents and case details so we can begin service.
          </p>

          {checkoutInfo && (
            <div className="bg-muted/50 border border-border rounded-xl p-6 text-left mb-8 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{checkoutInfo.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium">${checkoutInfo.packagePrice}</span>
              </div>
            </div>
          )}

          <Link to="/submit?paid=1">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-base gap-2">
              <FileText className="w-5 h-5" />
              Submit Your Documents
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}