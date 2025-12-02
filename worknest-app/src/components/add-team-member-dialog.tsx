"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMemberToTeam } from "@/actions/teams";
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
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTeamMemberDialogProps {
  teamId: string;
  organizationMembers: any[];
  currentTeamMembers: any[];
}

export function AddTeamMemberDialog({
  teamId,
  organizationMembers,
  currentTeamMembers,
}: AddTeamMemberDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");

  // Filter out members already in the team
  const currentMemberIds = currentTeamMembers.map((m) => m.userId);
  const availableMembers = organizationMembers.filter(
    (m) => !currentMemberIds.includes(m.userId)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError("Please select a member");
      return;
    }

    setLoading(true);
    setError("");

    const result = await addMemberToTeam(teamId, selectedUserId, selectedRole);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      setSelectedUserId("");
      setSelectedRole("member");
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add an existing organization member to this team
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="my-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 py-4">
            {availableMembers.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label>Select Member</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.user.name} ({member.user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Team Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Team Lead</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                All organization members are already in this team
              </p>
            )}
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
            <Button
              type="submit"
              disabled={loading || availableMembers.length === 0}
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
