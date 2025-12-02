import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getOrganizationMembers } from "@/actions/teams";
import { redirect } from "next/navigation";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { MemberRoleSelect } from "@/components/member-role-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function MembersPage() {
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

  const membersResult = await getOrganizationMembers(organization.id);
  const members = membersResult.success ? membersResult.members : [];

  // Check if current user is owner/admin
  const currentUserMember = members?.find((m: any) => m.userId === session.user.id);
  const canManageRoles = currentUserMember?.role === "owner" || currentUserMember?.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's members and their roles
          </p>
        </div>
        {canManageRoles && <InviteMemberDialog organizationId={organization.id} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Members ({members?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {members && members.length > 0 ? (
            <div className="space-y-4">
              {members.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user.image} alt={member.user.name} />
                      <AvatarFallback>
                        {member.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {canManageRoles && member.userId !== session.user.id ? (
                      <MemberRoleSelect
                        organizationId={organization.id}
                        memberId={member.id}
                        currentRole={member.role}
                      />
                    ) : (
                      <span className="text-sm bg-secondary px-3 py-1 rounded-full">
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No members found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
