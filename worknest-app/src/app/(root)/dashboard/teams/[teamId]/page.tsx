import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getTeamById, getOrganizationMembers } from "@/actions/teams";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { AddTeamMemberDialog } from "@/components/add-team-member-dialog";
import { EditTeamDialog } from "@/components/edit-team-dialog";
import { DeleteTeamDialog } from "@/components/delete-team-dialog";
import { RemoveTeamMemberButton } from "@/components/remove-team-member-button";
import { getCurrentUserMembership } from "@/actions/permissions";

interface TeamDetailPageProps {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId } = await params;
  
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

  const teamResult = await getTeamById(teamId);

  if (teamResult.error || !teamResult.team) {
    console.log("Team fetch error:", teamResult.error, "Team ID:", teamId);
    redirect("/dashboard/teams");
  }

  const team = teamResult.team;

  // Get organization members for adding to team
  const membersResult = await getOrganizationMembers(organization.id);
  const orgMembers = membersResult.success ? membersResult.members : [];

  // Check if current user is owner/admin
  const userMembership = await getCurrentUserMembership(organization.id);
  const canManage =
    userMembership?.role === "owner" || userMembership?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/teams">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          {team.description && (
            <p className="text-muted-foreground mt-2">{team.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/${organization.id}/teams/${team.id}/tasks`}>
              View Tasks
            </Link>
          </Button>
          {canManage && (
            <>
              <EditTeamDialog team={team} />
              <DeleteTeamDialog teamId={team.id} teamName={team.name} />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Created By</p>
              <p className="text-sm text-muted-foreground">
                {team.creator?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm text-muted-foreground">
                {new Date(team.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Members</p>
              <p className="text-sm text-muted-foreground">
                {team.members?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({team.members?.length || 0})
              </CardTitle>
              {canManage && (
                <AddTeamMemberDialog
                  teamId={team.id}
                  organizationMembers={orgMembers}
                  currentTeamMembers={team.members || []}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {team.members && team.members.length > 0 ? (
              <div className="space-y-3">
                {team.members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.user?.image}
                          alt={member.user?.name}
                        />
                        <AvatarFallback>
                          {member.user?.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.user?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.user?.email || ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {member.role}
                      </span>
                      {canManage && (
                        <RemoveTeamMemberButton
                          teamId={team.id}
                          userId={member.userId}
                          userName={member.user?.name || "this member"}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  No members in this team yet
                </p>
                {canManage && (
                  <AddTeamMemberDialog
                    teamId={team.id}
                    organizationMembers={orgMembers}
                    currentTeamMembers={team.members || []}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
