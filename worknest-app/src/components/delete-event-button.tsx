"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/calendar";
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

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle: string;
}

export function DeleteEventButton({
  eventId,
  eventTitle,
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    const result = await deleteEvent(eventId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/calendar");
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{eventTitle}"? This action cannot be
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
            {loading ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
