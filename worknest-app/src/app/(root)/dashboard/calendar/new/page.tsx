import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getOrganizationTeams, getOrganizationMembers } from "@/actions/teams";
import { redirect } from "next/navigation";
import { CreateEventForm } from "@/components/create-event-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewEventPage() {
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

  // Get teams and members for the form
  const teamsResult = await getOrganizationTeams(organization.id);
  const teams = teamsResult.success ? teamsResult.teams : [];

  const membersResult = await getOrganizationMembers(organization.id);
  const members = membersResult.success ? membersResult.members : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/calendar">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
          <p className="text-muted-foreground mt-2">
            Schedule a new event for your organization or team
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEventForm
            organizationId={organization.id}
            teams={teams}
            members={members}
          />
        </CardContent>
      </Card>
    </div>
  );
}
