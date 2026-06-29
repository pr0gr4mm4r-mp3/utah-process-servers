import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, Target } from "lucide-react";

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  delivered: "Delivered",
  failed: "Failed",
};

const STATUS_COLORS = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  in_progress: "text-blue-600 bg-blue-50 border-blue-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  failed: "text-red-600 bg-red-50 border-red-200",
};

export default function CaseHistoryLog({ caseId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.StatusLog.filter({ case_id: caseId }, "created_date", 50).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, [caseId]);

  if (loading) {
    return <div className="text-xs text-muted-foreground py-4 text-center">Loading history...</div>;
  }

  if (logs.length === 0) {
    return <div className="text-xs text-muted-foreground py-4 text-center">No history yet.</div>;
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-3 text-sm">
          <div className="mt-0.5 flex-shrink-0">
            {log.event_type === "attempt" ? (
              <Target className="w-4 h-4 text-primary" />
            ) : (
              <Clock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {log.event_type === "attempt" ? (
              <p className="font-medium text-foreground">
                Attempt #{log.attempt_number} — Service attempted
              </p>
            ) : (
              <p className="font-medium text-foreground">
                Status changed to{" "}
                <span className={`inline-block text-xs border px-1.5 py-0.5 rounded-full font-semibold ${STATUS_COLORS[log.status] || "text-foreground bg-muted border-border"}`}>
                  {STATUS_LABELS[log.status] || log.status}
                </span>
              </p>
            )}
            {log.note && <p className="text-xs text-muted-foreground mt-0.5">{log.note}</p>}
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(log.created_date), "MMM d, yyyy — h:mm a")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}