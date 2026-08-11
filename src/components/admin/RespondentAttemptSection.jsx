import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Target } from "lucide-react";
import { toast } from "sonner";

export default function RespondentAttemptSection({
  caseData,
  respondentIndex,
  respondentName,
  respondentAddress,
  attempts,
  onUpdate,
  onLogChange,
}) {
  const [recording, setRecording] = useState(false);

  const handleRecordAttempt = async (attemptNumber) => {
    if (recording) return;
    setRecording(true);
    try {
      let updateData = {};
      if (respondentIndex === -1) {
        updateData.service_attempts = attemptNumber;
      } else {
        const newRespondents = [...(caseData.additional_respondents || [])];
        newRespondents[respondentIndex] = {
          ...newRespondents[respondentIndex],
          attempts: attemptNumber,
        };
        updateData.additional_respondents = newRespondents;
      }

      const updated = await base44.entities.Case.update(caseData.id, updateData);

      await base44.entities.StatusLog.create({
        case_id: caseData.id,
        event_type: "attempt",
        attempt_number: attemptNumber,
        respondent_name: respondentName,
      });

      if (caseData.email) {
        await base44.functions.invoke("sendClientEmail", {
          to: caseData.email,
          subject: `Service Update — Attempt #${attemptNumber} for ${respondentName}`,
          body: `Dear ${caseData.attorney || "Valued Client"},

This is a courtesy notification from Utah Process Servers.

We have made Service Attempt #${attemptNumber} of 3 to serve your legal documents on the following respondent:

- Respondent: ${respondentName}
- Address: ${respondentAddress || "On file"}

Case Details:
- Case Number: ${caseData.case_number || "N/A"}

${attemptNumber < 3
  ? `We will make another attempt as part of your service package.`
  : `This was our final included attempt. Please contact us to discuss next steps if service was unsuccessful.`}

For questions, call (801) 755-5445 or email utahproservers@yahoo.com.

Utah Process Servers
Licensed & Bonded in Utah`.trim(),
        });
      }

      onUpdate(updated);
      onLogChange();
      toast.success(`Attempt #${attemptNumber} recorded for ${respondentName} — client notified`);
    } catch {
      toast.error("Failed to record attempt. Please try again.");
    } finally {
      setRecording(false);
    }
  };

  const handleRemoveAttempt = async () => {
    if (recording || attempts === 0) return;
    setRecording(true);
    try {
      const removedAttempt = attempts;
      const newAttempts = attempts - 1;

      let updateData = {};
      if (respondentIndex === -1) {
        updateData.service_attempts = newAttempts;
      } else {
        const newRespondents = [...(caseData.additional_respondents || [])];
        newRespondents[respondentIndex] = {
          ...newRespondents[respondentIndex],
          attempts: newAttempts,
        };
        updateData.additional_respondents = newRespondents;
      }

      const updated = await base44.entities.Case.update(caseData.id, updateData);

      await base44.entities.StatusLog.create({
        case_id: caseData.id,
        event_type: "attempt",
        attempt_number: removedAttempt,
        respondent_name: respondentName,
        note: "Attempt removed (deselected by admin)",
      });

      onUpdate(updated);
      onLogChange();
      toast.success(`Attempt #${removedAttempt} removed for ${respondentName}`);
    } catch {
      toast.error("Failed to remove attempt. Please try again.");
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="bg-muted/30 border border-border rounded-xl p-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground">{respondentName}</p>
        {respondentAddress && (
          <p className="text-xs text-muted-foreground mt-0.5">{respondentAddress}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            title={n === attempts ? `Click to remove Attempt #${n}` : undefined}
            onClick={() => {
              if (recording) return;
              if (n === attempts) {
                if (window.confirm(`Remove Service Attempt #${n} for ${respondentName}? This will decrement the attempt count.`)) {
                  handleRemoveAttempt();
                }
                return;
              }
              if (attempts < n) {
                if (window.confirm(`Confirm recording Service Attempt #${n} for ${respondentName}? This will notify the client and cannot be undone.`)) {
                  handleRecordAttempt(n);
                }
              }
            }}
            disabled={recording || n < attempts}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 text-sm font-bold transition-all ${
              attempts >= n
                ? n === attempts
                  ? "border-primary bg-primary/10 text-primary hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                  : "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Target className={`w-4 h-4 mb-1 ${attempts >= n ? "text-primary" : "text-muted-foreground"}`} />
            #{n}
          </button>
        ))}
        <div className="ml-2 text-sm text-muted-foreground">
          {attempts === 0 && "No attempts recorded"}
          {attempts === 1 && "1 of 3 attempts made"}
          {attempts === 2 && "2 of 3 attempts made"}
          {attempts === 3 && "All 3 attempts completed"}
        </div>
      </div>
    </div>
  );
}