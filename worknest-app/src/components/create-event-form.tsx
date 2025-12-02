"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateEventFormProps {
  organizationId: string;
  teams: any[];
  members: any[];
}

const eventTypes = [
  { value: "meeting", label: "Meeting" },
  { value: "deadline", label: "Deadline" },
  { value: "task", label: "Task" },
  { value: "holiday", label: "Holiday" },
];

const eventColors = [
  { value: "blue", label: "Blue" },
  { value: "emerald", label: "Emerald" },
  { value: "violet", label: "Violet" },
  { value: "orange", label: "Orange" },
  { value: "rose", label: "Rose" },
];

export function CreateEventForm({
  organizationId,
  teams,
  members,
}: CreateEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const startTime = formData.get("startTime") as string;
    const endDate = formData.get("endDate") as string;
    const endTime = formData.get("endTime") as string;
    const location = formData.get("location") as string;
    const teamId = formData.get("teamId") as string;
    const eventType = formData.get("eventType") as string;
    const color = formData.get("color") as string;

    // Combine date and time
    const startDateTime = isAllDay
      ? new Date(startDate)
      : new Date(`${startDate}T${startTime}`);
    const endDateTime = isAllDay
      ? new Date(endDate)
      : new Date(`${endDate}T${endTime}`);

    const result = await createEvent({
      organizationId,
      teamId: teamId && teamId !== "org-wide" ? teamId : undefined,
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      location,
      color,
      isAllDay,
      eventType,
      attendeeIds: selectedAttendees.length > 0 ? selectedAttendees : undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Event created successfully, redirect
      startTransition(() => {
        router.push("/dashboard/calendar");
        router.refresh();
      });
      // Don't set loading to false here - let the transition handle it
    }
  };

  const toggleAttendee = (userId: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Weekly Team Meeting"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type *</Label>
          <Select name="eventType" defaultValue="meeting" required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add event details..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAllDay"
          checked={isAllDay}
          onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
        />
        <Label htmlFor="isAllDay" className="cursor-pointer">
          All-day event
        </Label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>

        {!isAllDay && (
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              required={!isAllDay}
              defaultValue="09:00"
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>

        {!isAllDay && (
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time *</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              required={!isAllDay}
              defaultValue="10:00"
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Conference Room A"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select name="color" defaultValue="blue">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full bg-${color.value}-500`}
                    />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamId">Team (Optional)</Label>
        <Select name="teamId" defaultValue="org-wide">
          <SelectTrigger>
            <SelectValue placeholder="Organization-wide event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="org-wide">Organization-wide</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select "Organization-wide" for events visible to all members
        </p>
      </div>

      <div className="space-y-2">
        <Label>Attendees (Optional)</Label>
        <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
          {members.length > 0 ? (
            members.map((member) => (
              <div key={member.userId} className="flex items-center space-x-2">
                <Checkbox
                  id={`attendee-${member.userId}`}
                  checked={selectedAttendees.includes(member.userId)}
                  onCheckedChange={() => toggleAttendee(member.userId)}
                />
                <Label
                  htmlFor={`attendee-${member.userId}`}
                  className="cursor-pointer flex-1"
                >
                  {member.user.name} ({member.user.email})
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No members available</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading || isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || isPending}>
          {loading || isPending ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
