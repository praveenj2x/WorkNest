"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { calendarEvent, eventAttendee } from "@/db/schema";
import { eq, and, gte, lte, isNull, or } from "drizzle-orm";

export async function createEvent(data: {
  organizationId: string;
  teamId?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  color?: string;
  isAllDay?: boolean;
  eventType?: string;
  attendeeIds?: string[];
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const [event] = await db
      .insert(calendarEvent)
      .values({
        id: crypto.randomUUID(),
        organizationId: data.organizationId,
        teamId: data.teamId || null,
        title: data.title,
        description: data.description || null,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location || null,
        color: data.color || "blue",
        isAllDay: data.isAllDay || false,
        eventType: data.eventType || "meeting",
        createdBy: session.user.id,
      })
      .returning();

    // Add attendees if provided
    if (data.attendeeIds && data.attendeeIds.length > 0) {
      const attendees = data.attendeeIds.map((userId) => ({
        id: crypto.randomUUID(),
        eventId: event.id,
        userId,
        status: "pending",
      }));

      await db.insert(eventAttendee).values(attendees);
    }

    return { success: true, event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Failed to create event" };
  }
}

export async function getOrganizationEvents(
  organizationId: string,
  startDate?: Date,
  endDate?: Date
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", events: [] };
  }

  try {
    let query = db.query.calendarEvent.findMany({
      where: and(
        eq(calendarEvent.organizationId, organizationId),
        isNull(calendarEvent.teamId), // Only org-wide events
        startDate ? gte(calendarEvent.startTime, startDate) : undefined,
        endDate ? lte(calendarEvent.endTime, endDate) : undefined
      ),
      with: {
        creator: true,
        attendees: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (events, { asc }) => [asc(events.startTime)],
    });

    const events = await query;
    return { success: true, events };
  } catch (error) {
    console.error("Error fetching organization events:", error);
    return { error: "Failed to fetch events", events: [] };
  }
}

export async function getTeamEvents(
  teamId: string,
  startDate?: Date,
  endDate?: Date
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", events: [] };
  }

  try {
    const events = await db.query.calendarEvent.findMany({
      where: and(
        eq(calendarEvent.teamId, teamId),
        startDate ? gte(calendarEvent.startTime, startDate) : undefined,
        endDate ? lte(calendarEvent.endTime, endDate) : undefined
      ),
      with: {
        creator: true,
        attendees: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (events, { asc }) => [asc(events.startTime)],
    });

    return { success: true, events };
  } catch (error) {
    console.error("Error fetching team events:", error);
    return { error: "Failed to fetch events", events: [] };
  }
}

export async function getAllEventsForUser(
  organizationId: string,
  startDate?: Date,
  endDate?: Date
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", events: [] };
  }

  try {
    // Get all events where user is creator or attendee
    const events = await db.query.calendarEvent.findMany({
      where: and(
        eq(calendarEvent.organizationId, organizationId),
        startDate ? gte(calendarEvent.startTime, startDate) : undefined,
        endDate ? lte(calendarEvent.endTime, endDate) : undefined
      ),
      with: {
        creator: true,
        team: true,
        attendees: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (events, { asc }) => [asc(events.startTime)],
    });

    return { success: true, events };
  } catch (error) {
    console.error("Error fetching user events:", error);
    return { error: "Failed to fetch events", events: [] };
  }
}

export async function updateEvent(
  eventId: string,
  data: {
    title?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    location?: string;
    color?: string;
    isAllDay?: boolean;
    eventType?: string;
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(calendarEvent)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(calendarEvent.id, eventId));

    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { error: "Failed to update event" };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(calendarEvent).where(eq(calendarEvent.id, eventId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { error: "Failed to delete event" };
  }
}

export async function updateAttendeeStatus(
  eventId: string,
  status: "accepted" | "declined"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(eventAttendee)
      .set({ status })
      .where(
        and(
          eq(eventAttendee.eventId, eventId),
          eq(eventAttendee.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error updating attendee status:", error);
    return { error: "Failed to update status" };
  }
}
