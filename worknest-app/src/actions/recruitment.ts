"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { candidate, candidateDocument, member } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function inviteCandidate(
  organizationId: string,
  email: string,
  position: string
) {
  const { checkUserPermission } = await import("@/actions/permissions");
  const permissionCheck = await checkUserPermission(organizationId, ["owner", "admin"]);

  if (!permissionCheck.authorized) {
    return { error: permissionCheck.error };
  }

  const session = permissionCheck.session;

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const [newCandidate] = await db
      .insert(candidate)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        email,
        position,
        invitedBy: session.user.id,
        token,
        expiresAt,
        status: "invited",
      })
      .returning();

    // Send email invitation
    await sendCandidateInvitation(email, position, token, session.user.name);

    return { success: true, candidate: newCandidate };
  } catch (error) {
    console.error("Error inviting candidate:", error);
    return { error: "Failed to invite candidate" };
  }
}

export async function getCandidateByToken(token: string) {
  try {
    const candidateData = await db.query.candidate.findFirst({
      where: eq(candidate.token, token),
      with: {
        organization: true,
        documents: true,
      },
    });

    if (!candidateData) {
      return { error: "Invalid or expired invitation" };
    }

    if (new Date() > candidateData.expiresAt) {
      return { error: "Invitation has expired" };
    }

    return { success: true, candidate: candidateData };
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return { error: "Failed to fetch candidate" };
  }
}

export async function submitCandidateInfo(
  token: string,
  data: {
    name: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  }
) {
  try {
    const candidateData = await db.query.candidate.findFirst({
      where: eq(candidate.token, token),
    });

    if (!candidateData) {
      return { error: "Invalid invitation" };
    }

    if (candidateData.status !== "invited") {
      return { error: "Application already submitted" };
    }

    await db
      .update(candidate)
      .set({
        name: data.name,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        status: "submitted",
        submittedAt: new Date(),
      })
      .where(eq(candidate.id, candidateData.id));

    return { success: true };
  } catch (error) {
    console.error("Error submitting candidate info:", error);
    return { error: "Failed to submit information" };
  }
}

export async function uploadCandidateDocument(
  candidateId: string,
  type: string,
  fileName: string,
  fileUrl: string,
  fileSize: string
) {
  try {
    await db.insert(candidateDocument).values({
      id: crypto.randomUUID(),
      candidateId,
      type,
      fileName,
      fileUrl,
      fileSize,
    });

    return { success: true };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { error: "Failed to upload document" };
  }
}

export async function getOrganizationCandidates(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", candidates: [] };
  }

  try {
    const candidates = await db.query.candidate.findMany({
      where: eq(candidate.organizationId, organizationId),
      with: {
        inviter: true,
        reviewer: true,
        documents: true,
      },
      orderBy: [desc(candidate.invitedAt)],
    });

    return { success: true, candidates };
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return { error: "Failed to fetch candidates", candidates: [] };
  }
}

export async function updateCandidateStatus(
  candidateId: string,
  status: string,
  notes?: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  // Verify candidate exists and get organization
  const candidateData = await db.query.candidate.findFirst({
    where: eq(candidate.id, candidateId),
  });

  if (!candidateData) {
    return { error: "Candidate not found" };
  }

  // Check permissions
  const { checkUserPermission } = await import("@/actions/permissions");
  const permissionCheck = await checkUserPermission(candidateData.organizationId, [
    "owner",
    "admin",
  ]);

  if (!permissionCheck.authorized) {
    return { error: permissionCheck.error };
  }

  try {
    await db
      .update(candidate)
      .set({
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      })
      .where(eq(candidate.id, candidateId));

    return { success: true };
  } catch (error) {
    console.error("Error updating candidate status:", error);
    return { error: "Failed to update status" };
  }
}

async function sendCandidateInvitation(
  email: string,
  position: string,
  token: string,
  inviterName: string
) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured");
    return;
  }

  const applicationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/recruitment/apply/${token}`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject: `Job Application Invitation - ${position}`,
        html: `
          <h2>You've been invited to apply!</h2>
          <p>${inviterName} has invited you to apply for the position of <strong>${position}</strong>.</p>
          <p>Please complete your application by clicking the link below:</p>
          <p><a href="${applicationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Complete Application</a></p>
          <p>This invitation will expire in 14 days.</p>
          <p>If you have any questions, please contact the hiring team.</p>
        `,
      }),
    });
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
}
