"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { organization, member, invitation, session } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function createOrganization(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
        return { error: "Name and slug are required" };
    }

    // Check if slug already exists
    const existingOrg = await db.query.organization.findFirst({
        where: eq(organization.slug, slug)
    });

    if (existingOrg) {
        return { error: "Organization slug already exists" };
    }

    try {
        // Create organization
        const [newOrg] = await db.insert(organization).values({
            id: crypto.randomUUID(),
            name,
            slug,
            createdAt: new Date(),
        }).returning();

        // Add user as owner
        await db.insert(member).values({
            id: crypto.randomUUID(),
            organizationId: newOrg.id,
            userId: session.user.id,
            role: "owner",
            createdAt: new Date(),
        });

        return { success: true, organizationId: newOrg.id };
    } catch (error) {
        console.error("Error creating organization:", error);
        return { error: "Failed to create organization" };
    }
}

export async function inviteMembers(organizationId: string, emails: string[]) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    // Verify user is member of the organization
    const membership = await db.query.member.findFirst({
        where: eq(member.userId, session.user.id)
    });

    if (!membership || membership.organizationId !== organizationId) {
        return { error: "Unauthorized" };
    }

    try {
        const invitations = emails.map(email => ({
            id: crypto.randomUUID(),
            organizationId,
            email: email.trim(),
            role: "member",
            status: "pending",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            inviterId: session.user.id,
        }));

        await db.insert(invitation).values(invitations);

        // Send emails (we'll implement this next)
        await sendInvitationEmails(emails, organizationId, session.user.name);

        return { success: true };
    } catch (error) {
        console.error("Error inviting members:", error);
        return { error: "Failed to send invitations" };
    }
}

async function sendInvitationEmails(emails: string[], organizationId: string, inviterName: string) {
    // Get organization details
    const org = await db.query.organization.findFirst({
        where: eq(organization.id, organizationId)
    });

    if (!org) return;

    // Send emails using Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
        console.warn("RESEND_API_KEY not configured");
        return;
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invite`;

    for (const email of emails) {
        try {
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                    to: email,
                    subject: `You've been invited to join ${org.name}`,
                    html: `
                        <h2>You've been invited!</h2>
                        <p>${inviterName} has invited you to join <strong>${org.name}</strong>.</p>
                        <p><a href="${inviteUrl}?email=${encodeURIComponent(email)}&org=${organizationId}">Accept Invitation</a></p>
                        <p>This invitation will expire in 7 days.</p>
                    `,
                }),
            });
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
        }
    }
}

export async function getPendingInvitations() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return [];
    }

    const invitations = await db.query.invitation.findMany({
        where: (invitation, { eq, and }) => and(
            eq(invitation.email, session.user.email),
            eq(invitation.status, "pending")
        ),
        with: {
            organization: true
        }
    });

    // Filter out expired invitations
    return invitations.filter(inv => new Date() < inv.expiresAt);
}


export async function getUserOrganization() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return null;
    }

    // Get the active organization from session or the first one
    const activeOrgId = session.session.activeOrganizationId;

    if (activeOrgId) {
        const membership = await db.query.member.findFirst({
            where: (member, { eq, and }) => and(
                eq(member.userId, session.user.id),
                eq(member.organizationId, activeOrgId)
            ),
            with: {
                organization: true
            }
        });
        if (membership) {
            return membership.organization;
        }
    }

    // Fallback to first organization
    const membership = await db.query.member.findFirst({
        where: eq(member.userId, session.user.id),
        with: {
            organization: true
        }
    });

    return membership?.organization || null;
}

export async function getUserOrganizations() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return [];
    }

    const memberships = await db.query.member.findMany({
        where: eq(member.userId, session.user.id),
        with: {
            organization: true
        }
    });

    return memberships.map(m => ({
        ...m.organization,
        role: m.role,
        membershipId: m.id
    }));
}

export async function acceptInvitation(email: string, organizationId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { error: "You must be signed in to accept an invitation" };
    }

    // Verify the email matches the signed-in user
    if (session.user.email !== email) {
        return { error: "This invitation is for a different email address" };
    }

    try {
        // Find the invitation
        const invite = await db.query.invitation.findFirst({
            where: (invitation, { eq, and }) => and(
                eq(invitation.email, email),
                eq(invitation.organizationId, organizationId)
            ),
        });

        if (!invite) {
            return { error: "Invitation not found" };
        }

        // Check if invitation has expired
        if (new Date() > invite.expiresAt) {
            return { error: "This invitation has expired" };
        }

        // Check if invitation is still pending
        if (invite.status !== "pending") {
            return { error: "This invitation has already been used" };
        }

        // Check if user is already a member of THIS specific organization
        const existingMember = await db.query.member.findFirst({
            where: (member, { eq, and }) => and(
                eq(member.userId, session.user.id),
                eq(member.organizationId, organizationId)
            ),
        });

        if (existingMember) {
            return { error: "You are already a member of this organization" };
        }

        // Create member record
        await db.insert(member).values({
            id: crypto.randomUUID(),
            organizationId: organizationId,
            userId: session.user.id,
            role: invite.role || "member",
            createdAt: new Date(),
        });

        // Update invitation status
        await db
            .update(invitation)
            .set({ status: "accepted" })
            .where(eq(invitation.id, invite.id));

        return { success: true };
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return { error: "Failed to accept invitation" };
    }
}

export async function setActiveOrganization(organizationId: string) {
    const authSession = await auth.api.getSession({
        headers: await headers()
    });

    if (!authSession) {
        return { error: "Unauthorized" };
    }

    // Verify user is a member of this organization
    const membership = await db.query.member.findFirst({
        where: and(
            eq(member.userId, authSession.user.id),
            eq(member.organizationId, organizationId)
        ),
    });

    if (!membership) {
        return { error: "You are not a member of this organization" };
    }

    try {
        // Update the session's active organization
        await db
            .update(session)
            .set({ activeOrganizationId: organizationId })
            .where(eq(session.userId, authSession.user.id));

        return { success: true };
    } catch (error) {
        console.error("Error setting active organization:", error);
        return { error: "Failed to set active organization" };
    }
}

