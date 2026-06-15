import React from "react";
import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  return (
    <AuthLayout
      icon={ShieldX}
      title="Registration Disabled"
      subtitle="Self-registration is not permitted for this application"
    >
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm text-center mb-6">
        Access is restricted to authorized Utah Process Servers personnel only.
        New accounts must be provisioned by an administrator.
      </div>
      <Link to="/login" className="block text-center text-sm text-primary font-medium hover:underline">
        ← Back to Login
      </Link>
    </AuthLayout>
  );
}