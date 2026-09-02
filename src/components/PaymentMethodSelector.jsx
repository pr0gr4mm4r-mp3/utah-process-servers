import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Smartphone, Loader2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// PayPal icon SVG
const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" fill="#009cde"/>
  </svg>
);

export default function PaymentMethodSelector({ pkg, onClose, existingCase }) {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingPaypal, setLoadingPaypal] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState(null);
  const [paypalRetryKey, setPaypalRetryKey] = useState(0);

  const basePrice = parseFloat(pkg.price) || 0;
  const processingFee = basePrice * 0.035;
  const totalPrice = (basePrice + processingFee).toFixed(2);

  useEffect(() => {
    base44.functions.invoke("getPaymentConfig")
      .then((res) => {
        setConfig(res.data || {});
      })
      .catch(() => {
        // Backend function unavailable (e.g. plan doesn't include functions) —
        // fall back to empty config so manual payment options still render.
        setConfig({});
      })
      .finally(() => setLoadingConfig(false));
  }, []);

  // Load PayPal SDK when config is ready
  useEffect(() => {
    if (!config?.paypalClientId) return;
    if (document.getElementById("paypal-sdk")) {
      setPaypalReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${config.paypalClientId}&currency=USD`;
    script.onload = () => {
      setPaypalReady(true);
    };
    document.body.appendChild(script);
  }, [config]);

  // Render PayPal buttons after SDK ready
  useEffect(() => {
    if (!paypalReady || !config?.paypalClientId) return;
    const container = document.getElementById("paypal-button-container");
    if (!container) return;
    // Clear any previous buttons (for retries)
    container.innerHTML = "";

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        setPaypalError(null);
        return actions.order.create({
          purchase_units: [{
            description: pkg.name,
            amount: { currency_code: "USD", value: totalPrice },
          }],
        });
      },
      onApprove: (data, actions) => {
        setLoadingPaypal(true);
        setPaypalError(null);
        return base44.functions.invoke("paypalCaptureOrder", { orderID: data.orderID })
          .then((res) => {
            setLoadingPaypal(false);
            if (res.data?.success) {
              if (existingCase) {
                base44.functions.invoke("updateCasePayment", {
                  caseId: existingCase.id,
                  paymentMethod: "paypal",
                  checkoutId: data.orderID,
                  isInstant: true,
                }).then(() => {
                  window.location.href = `/case-lookup?email=${encodeURIComponent(existingCase.email || "")}&paid=1`;
                }).catch(() => {
                  setLoadingPaypal(false);
                  setPaypalError("Payment was captured but we couldn't update your case. Please contact us at (801) 755-5445.");
                });
              } else {
                localStorage.setItem("ups_checkout", JSON.stringify({
                  sessionId: data.orderID,
                  packageName: pkg.name,
                  packagePrice: totalPrice,
                  serviceType: pkg.serviceType,
                  paymentMethod: "paypal",
                }));
                window.location.href = "/thank-you";
              }
            } else {
              setPaypalError(res.data?.error || "Payment could not be verified by PayPal. You can try the PayPal button again below — your submission is saved.");
              toast.error("Payment could not be verified. Please try again.");
            }
          })
          .catch(() => {
            setLoadingPaypal(false);
            setPaypalError("Payment verification failed. You can try the PayPal button again below — your submission is saved.");
            toast.error("Payment verification failed. Please try again or contact us.");
          });
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        setLoadingPaypal(false);
        setPaypalError("PayPal checkout encountered an error. You can try again below or use another payment method.");
        toast.error("PayPal checkout failed. Please try again or use another method.");
      },
    }).render("#paypal-button-container");
  }, [paypalReady, pkg, paypalRetryKey]);

  const handleManual = (method) => {
    const params = new URLSearchParams({
      method,
      packageName: pkg.name,
      packagePrice: totalPrice,
      serviceType: pkg.serviceType,
    });
    if (existingCase) {
      params.set("caseId", existingCase.id);
      if (existingCase.email) params.set("email", existingCase.email);
    }
    window.location.href = `/payment-manual?${params.toString()}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto my-8 p-8"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <p className="text-xs tracking-[0.15em] uppercase text-primary font-semibold mb-1">Select Payment Method</p>
            <h3 className="font-heading text-xl font-bold text-foreground">{pkg.name}</h3>
            <div className="mt-1 space-y-0.5">
              <p className="text-sm text-muted-foreground">Subtotal: ${basePrice.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Processing fee (3.5%): ${processingFee.toFixed(2)}</p>
              <p className="text-2xl font-bold text-foreground pt-1">Total: ${totalPrice}</p>
            </div>
            {pkg.addressCount > 1 && (
              <p className="text-xs text-muted-foreground mt-1">{pkg.addressCount} addresses × ${pkg.basePrice} each</p>
            )}
          </div>

          {loadingConfig ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* PayPal */}
              {config?.paypalClientId && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 pt-3 pb-1 text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <PayPalIcon />
                    Pay with PayPal
                  </div>
                  <div className="px-4 pb-3">
                    {loadingPaypal && (
                      <div className="flex items-center justify-center py-4 mb-3 bg-muted/30 rounded-lg">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">Verifying payment...</span>
                      </div>
                    )}
                    {paypalError && (
                      <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{paypalError}</span>
                      </div>
                    )}
                    {paypalReady ? (
                      <div id="paypal-button-container" />
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading PayPal...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or pay manually</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Zelle */}
              <button
                onClick={() => handleManual("zelle")}
                className="w-full border border-border rounded-xl px-4 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-[#6D1ED4]/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-[#6D1ED4]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Pay with Zelle</p>
                  <p className="text-xs text-muted-foreground">Send to our Zelle email/phone</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">Manual verification</span>
              </button>

              {/* Venmo */}
              <button
                onClick={() => handleManual("venmo")}
                className="w-full border border-border rounded-xl px-4 py-4 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-[#008CFF]/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-[#008CFF]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Pay with Venmo</p>
                  <p className="text-xs text-muted-foreground">Send to our Venmo handle</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">Manual verification</span>
              </button>

              <p className="text-xs text-muted-foreground text-center pt-2">
                Zelle & Venmo payments are verified manually. Services begin after confirmation.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}