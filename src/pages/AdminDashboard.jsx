import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, LogOut, FileText, Clock, CheckCircle, AlertCircle, ChevronRight, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CaseRow from "@/components/admin/CaseRow";
import CaseDetailModal from "@/components/admin/CaseDetailModal";
import InviteUserModal from "@/components/admin/InviteUserModal";

const TABS = [
  { key: "submitted", label: "By Date Submitted" },
  { key: "delivered", label: "By Date Delivered" },
  { key: "pending", label: "Pending" },
];

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submitted");
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    // Verify user is admin
    base44.auth.me().then((user) => {
      if (!user || user.role !== "admin") {
        window.location.href = "/login";
      }
    });
    loadCases();

    // Real-time subscription for new submissions
    const unsubscribe = base44.entities.Case.subscribe((event) => {
      if (event.type === "create") {
        setCases((prev) => [event.data, ...prev]);
        setNewCount((n) => n + 1);
      } else if (event.type === "update") {
        setCases((prev) =>
          prev.map((c) => (c.id === event.id ? event.data : c))
        );
      } else if (event.type === "delete") {
        setCases((prev) => prev.filter((c) => c.id !== event.id));
      }
    });

    return () => unsubscribe();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    const data = await base44.entities.Case.list("-created_date", 200);
    setCases(data);
    setLoading(false);
  };

  const handleCaseUpdate = (updatedCase) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    setSelectedCase(updatedCase);
  };

  const filteredAndSorted = () => {
    let list = [...cases];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.attorney?.toLowerCase().includes(q) ||
          c.respondent_name?.toLowerCase().includes(q) ||
          c.case_number?.toLowerCase().includes(q) ||
          c.county?.toLowerCase().includes(q)
      );
    }

    if (activeTab === "submitted") {
      list.sort(
        (a, b) =>
          new Date(b.submitted_at || b.created_date) -
          new Date(a.submitted_at || a.created_date)
      );
    } else if (activeTab === "delivered") {
      list = list.filter((c) => c.delivered_at);
      list.sort((a, b) => new Date(b.delivered_at) - new Date(a.delivered_at));
    } else if (activeTab === "pending") {
      list = list.filter((c) => c.status === "pending" || c.status === "in_progress");
      list.sort(
        (a, b) =>
          new Date(a.submitted_at || a.created_date) -
          new Date(b.submitted_at || b.created_date)
      );
    }

    return list;
  };

  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === "pending").length,
    in_progress: cases.filter((c) => c.status === "in_progress").length,
    delivered: cases.filter((c) => c.status === "delivered").length,
  };

  const sorted = filteredAndSorted();

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* Top bar */}
      <header className="bg-[#1A1C1E] text-white px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border-2 border-[#C4A265] rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#C4A265] rounded-full" />
          </div>
          <span className="font-heading text-lg font-semibold">
            Utah Process Servers — Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          {newCount > 0 && (
            <button
              onClick={() => { setNewCount(0); setActiveTab("submitted"); }}
              className="flex items-center gap-2 bg-[#C4A265]/15 border border-[#C4A265]/30 text-[#C4A265] px-3 py-1.5 rounded-lg text-sm font-medium animate-pulse"
            >
              <Bell className="w-4 h-4" />
              {newCount} new submission{newCount > 1 ? "s" : ""}
            </button>
          )}
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
          <Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">
            View Site
          </Link>
          <button
            onClick={() => base44.auth.logout("/")}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Cases", value: stats.total, icon: FileText, color: "text-foreground" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
            { label: "In Progress", value: stats.in_progress, icon: AlertCircle, color: "text-blue-600" },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-600" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`font-heading text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-white border border-border rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "bg-[#1A1C1E] text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attorney, respondent, case #..."
              className="pl-9 w-72 bg-white"
            />
          </div>
        </div>

        {/* Cases table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
              <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin mr-3" />
              Loading cases...
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No cases found</p>
            </div>
          ) : (
            <div>
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_40px] gap-4 px-6 py-3 border-b border-border bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide font-medium">
                <span>Case #</span>
                <span>Attorney / Respondent</span>
                <span>Service Type</span>
                <span>Status</span>
                <span>Submitted</span>
                <span />
              </div>
              {sorted.map((c) => (
                <CaseRow
                  key={c.id}
                  caseData={c}
                  onClick={() => setSelectedCase(c)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showInvite && <InviteUserModal onClose={() => setShowInvite(false)} />}

      {selectedCase && (
        <CaseDetailModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdate={handleCaseUpdate}
        />
      )}
    </div>
  );
}