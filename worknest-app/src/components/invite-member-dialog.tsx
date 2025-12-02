"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteMembers } from "@/actions/organization";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, X } from "lucide-react";

interface InviteMemberDialogProps {
  organizationId: string;
}

export function InviteMemberDialog({ organizationId }: InviteMemberDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emails, setEmails] = useState([""]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validEmails = emails.filter((email) => email.trim() !== "");

    if (validEmails.length === 0) {
      setError("Please enter at least one email");
      setLoading(false);
      return;
    }

    const result = await inviteMembers(organizationId, validEmails);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      setEmails([""]);
      router.refresh();
    }
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Send email invitations to new members
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`email-${index}`}>Email {index + 1}</Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="colleague@example.com"
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEmail(index)}
                    className="mt-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEmailField}
              className="w-full"
            >
              + Add Another Email
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invitations"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
