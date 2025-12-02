"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCandidateStatus } from "@/actions/recruitment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye } from "lucide-react";

interface CandidateStatusActionsProps {
  candidateId: string;
}

export function CandidateStatusActions({
  candidateId,
}: CandidateStatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleStatusUpdate = async (status: string) => {
    setLoading(true);
    const result = await updateCandidateStatus(candidateId, status, notes);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Review Notes (Optional)</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this candidate..."
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleStatusUpdate("reviewing")}
          disabled={loading}
          variant="outline"
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          Mark as Reviewing
        </Button>
        <Button
          onClick={() => handleStatusUpdate("approved")}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={() => handleStatusUpdate("rejected")}
          disabled={loading}
          variant="destructive"
          className="flex-1"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
}
