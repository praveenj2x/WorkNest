import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getOrganizationEvents } from "@/actions/calendar";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { CalendarView } from "@/components/calendar-view";

export default async function OrganizationCalendarPage() {
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

  // Get organization-wide events
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const eventsResult = await getOrganizationEvents(
    organization.id,
    startOfMonth,
    endOfMonth
  );
  const events = eventsResult.success ? eventsResult.events : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/calendar">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Calendar
          </h1>
          <p className="text-muted-foreground mt-2">
            Events visible to all members of {organization.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/calendar/new">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Organization Events ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <CalendarView events={events} />
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No organization events
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create organization-wide events that all members can see
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
    </div>
  );
}
