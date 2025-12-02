import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { getOrganizationCandidates } from "@/actions/recruitment";
import { redirect } from "next/navigation";
import { InviteCandidateDialog } from "@/components/invite-candidate-dialog";
import { CandidateCard } from "@/components/candidate-card";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default async function RecruitmentPage() {
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

  const candidatesResult = await getOrganizationCandidates(organization.id);
  const candidates = candidatesResult.success ? candidatesResult.candidates : [];

  // Check if current user is owner/admin
  const { getCurrentUserMembership } = await import("@/actions/permissions");
  const userMembership = await getCurrentUserMembership(organization.id);
  const canInvite = userMembership?.role === "owner" || userMembership?.role === "admin";

  // Group candidates by status
  const invited = candidates?.filter((c: any) => c.status === "invited") || [];
  const submitted = candidates?.filter((c: any) => c.status === "submitted") || [];
  const reviewing = candidates?.filter((c: any) => c.status === "reviewing") || [];
  const approved = candidates?.filter((c: any) => c.status === "approved") || [];
  const rejected = candidates?.filter((c: any) => c.status === "rejected") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground mt-2">
            Manage candidate applications and onboarding
          </p>
        </div>
        {canInvite && <InviteCandidateDialog organizationId={organization.id} />}
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{invited.length}</div>
            <p className="text-xs text-muted-foreground">Invited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{submitted.length}</div>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{reviewing.length}</div>
            <p className="text-xs text-muted-foreground">Reviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{approved.length}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{rejected.length}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {candidates && candidates.length > 0 ? (
        <div className="space-y-6">
          {submitted.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">New Applications</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {submitted.map((candidate: any) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          )}

          {reviewing.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Under Review</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {reviewing.map((candidate: any) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          )}

          {invited.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Pending Invitations</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {invited.map((candidate: any) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Approved</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {approved.map((candidate: any) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          )}

          {rejected.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Rejected</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {rejected.map((candidate: any) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No candidates yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by inviting candidates to apply
            </p>
            {canInvite && <InviteCandidateDialog organizationId={organization.id} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
