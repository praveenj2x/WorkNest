import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { candidate } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CandidateStatusActions } from "@/components/candidate-status-actions";

interface CandidateDetailPageProps {
  params: Promise<{
    candidateId: string;
  }>;
}

const statusColors: Record<string, string> = {
  invited: "bg-blue-100 text-blue-800",
  submitted: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function CandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const { candidateId } = await params;
  
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

  const candidateData = await db.query.candidate.findFirst({
    where: eq(candidate.id, candidateId),
    with: {
      inviter: true,
      reviewer: true,
      documents: true,
    },
  });

  if (!candidateData || candidateData.organizationId !== organization.id) {
    redirect("/dashboard/recruitment");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/recruitment">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {candidateData.name || candidateData.email}
          </h1>
          <p className="text-muted-foreground mt-1">{candidateData.position}</p>
        </div>
        <Badge className={statusColors[candidateData.status] || ""}>
          {candidateData.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">
                  {candidateData.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {candidateData.email}
                </p>
              </div>
            </div>

            {candidateData.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {candidateData.phone}
                  </p>
                </div>
              </div>
            )}

            {candidateData.dateOfBirth && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(candidateData.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {candidateData.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {candidateData.address}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Position</p>
              <p className="text-sm text-muted-foreground">
                {candidateData.position}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Invited By</p>
              <p className="text-sm text-muted-foreground">
                {candidateData.inviter?.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Invited At</p>
              <p className="text-sm text-muted-foreground">
                {new Date(candidateData.invitedAt).toLocaleString()}
              </p>
            </div>

            {candidateData.submittedAt && (
              <div>
                <p className="text-sm font-medium">Submitted At</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(candidateData.submittedAt).toLocaleString()}
                </p>
              </div>
            )}

            {candidateData.reviewedAt && (
              <>
                <div>
                  <p className="text-sm font-medium">Reviewed At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(candidateData.reviewedAt).toLocaleString()}
                  </p>
                </div>
                {candidateData.reviewer && (
                  <div>
                    <p className="text-sm font-medium">Reviewed By</p>
                    <p className="text-sm text-muted-foreground">
                      {candidateData.reviewer.name}
                    </p>
                  </div>
                )}
              </>
            )}

            {candidateData.notes && (
              <div>
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">
                  {candidateData.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {candidateData.documents && candidateData.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidateData.documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {doc.fileSize || "Unknown size"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {candidateData.status === "submitted" && (
        <Card>
          <CardHeader>
            <CardTitle>Review Application</CardTitle>
          </CardHeader>
          <CardContent>
            <CandidateStatusActions candidateId={candidateData.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
