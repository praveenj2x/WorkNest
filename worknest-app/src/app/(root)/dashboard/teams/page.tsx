import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getOrganizationTeams } from "@/actions/teams";
import { redirect } from "next/navigation";
import { CreateTeamDialog } from "@/components/create-team-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function TeamsPage() {
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

  const teamsResult = await getOrganizationTeams(organization.id);
  const teams = teamsResult.success ? teamsResult.teams : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's teams
          </p>
        </div>
        <CreateTeamDialog organizationId={organization.id} />
      </div>

      {teams && teams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team: any) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {team.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {team.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {team.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {team.members?.length || 0} members
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teams/${team.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first team to get started
            </p>
            <CreateTeamDialog organizationId={organization.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
