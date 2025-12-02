"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeMemberFromTeam } from "@/actions/teams";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RemoveTeamMemberButtonProps {
  teamId: string;
  userId: string;
  userName: string;
}

export function RemoveTeamMemberButton({
  teamId,
  userId,
  userName,
}: RemoveTeamMemberButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm(`Remove ${userName} from this team?`)) {
      return;
    }

    setLoading(true);
    const result = await removeMemberFromTeam(teamId, userId);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={loading}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
