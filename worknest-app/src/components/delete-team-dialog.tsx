"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTeam } from "@/actions/teams";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteTeamDialogProps {
  teamId: string;
  teamName: string;
}

export function DeleteTeamDialog({ teamId, teamName }: DeleteTeamDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    const result = await deleteTeam(teamId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/teams");
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{teamName}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="my-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
