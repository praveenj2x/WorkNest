import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getAllEventsForUser } from "@/actions/calendar";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Link as Link1, Plus, Users } from "lucide-react";
import Link from "next/link";
import { CalendarView } from "@/components/calendar-view";
export default async function CalendarPage() {
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

  // Get events for the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const eventsResult = await getAllEventsForUser(
    organization.id,
    startOfMonth,
    endOfMonth
  );
  const events = eventsResult.success ? eventsResult.events : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization and team events
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/calendar/new">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {events.filter((e: any) => !e.teamId).length}
            </div>
            <p className="text-xs text-muted-foreground">Organization Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {events.filter((e: any) => e.teamId).length}
            </div>
            <p className="text-xs text-muted-foreground">Team Events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <CalendarView events={events} />
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first event to get started
              </p>
              <Button asChild>
                <Link href="/dashboard/calendar/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/calendar/organization">
                <Building2 className="h-4 w-4 mr-2" />
                Organization Calendar
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/teams">
                <Users className="h-4 w-4 mr-2" />
                Team Calendars
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Meetings</span>
              <span className="text-sm font-medium">
                {events.filter((e: any) => e.eventType === "meeting").length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Deadlines</span>
              <span className="text-sm font-medium">
                {events.filter((e: any) => e.eventType === "deadline").length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Tasks</span>
              <span className="text-sm font-medium">
                {events.filter((e: any) => e.eventType === "task").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
