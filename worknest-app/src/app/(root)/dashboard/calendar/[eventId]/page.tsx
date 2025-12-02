import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { calendarEvent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users as UsersIcon,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteEventButton } from "@/components/delete-event-button";

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  emerald: "bg-emerald-100 text-emerald-800",
  violet: "bg-violet-100 text-violet-800",
  orange: "bg-orange-100 text-orange-800",
  rose: "bg-rose-100 text-rose-800",
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const organization = await getUserOrganization();

  if (!organization) {
    redirect("/onboarding");
  }

  const event = await db.query.calendarEvent.findFirst({
    where: eq(calendarEvent.id, eventId),
    with: {
      creator: true,
      team: true,
      attendees: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!event || event.organizationId !== organization.id) {
    redirect("/dashboard/calendar");
  }

  const isCreator = event.createdBy === session.user.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/calendar">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={colorClasses[event.color] || colorClasses.blue}>
              {event.eventType}
            </Badge>
            {event.team && (
              <Badge variant="outline">{event.team.name}</Badge>
            )}
          </div>
        </div>
        {isCreator && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/calendar/${eventId}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <DeleteEventButton eventId={eventId} eventTitle={event.title} />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.description && (
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">
                  {event.isAllDay
                    ? "All Day"
                    : `${format(new Date(event.startTime), "h:mm a")} - ${format(new Date(event.endTime), "h:mm a")}`}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">
                  {event.creator?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Attendees ({event.attendees?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.attendees && event.attendees.length > 0 ? (
              <div className="space-y-3">
                {event.attendees.map((attendee: any) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={attendee.user?.image}
                          alt={attendee.user?.name}
                        />
                        <AvatarFallback>
                          {attendee.user?.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {attendee.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attendee.user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        attendee.status === "accepted"
                          ? "default"
                          : attendee.status === "declined"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {attendee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No attendees added
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
