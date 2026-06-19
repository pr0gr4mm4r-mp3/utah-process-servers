import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function InviteUserModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    await base44.users.inviteUser(email.trim(), "user");
    setSent(true);
    setSending(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Invitation Sent
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                A secure one-time registration link has been sent to{" "}
                <strong>{email}</strong>. The link will expire after first use.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => { setEmail(""); setSent(false); }}
                >
                  Invite Another
                </Button>
                <Button onClick={onClose} className="bg-primary text-primary-foreground">
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">Invite New User</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Send a one-time secure registration link
                  </p>
                </div>
              </div>

              <form onSubmit={handleInvite} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="colleague@firm.com"
                      className="pl-9"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The recipient will receive a private link to create their account. Links are single-use and expire after first use.
                  </p>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={sending || !email.trim()}
                    className="flex-1 bg-primary text-primary-foreground gap-2"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {sending ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}