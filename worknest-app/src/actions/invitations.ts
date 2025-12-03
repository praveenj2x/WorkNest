"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { invitation } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Check if the current user has any pending invitations
 * This can be called after sign-in to automatically redirect users to accept invitations
 */
export async function checkPendingInvitations() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { invitations: [] };
    }

    try {
        const pendingInvites = await db.query.invitation.findMany({
            where: (invitation, { eq, and }) => and(
                eq(invitation.email, session.user.email),
                eq(invitation.status, "pending")
            ),
            with: {
                organization: true,
            },
        });

        // Filter out expired invitations
        const validInvites = pendingInvites.filter(
            invite => new Date() < invite.expiresAt
        );

        return { invitations: validInvites };
    } catch (error) {
        console.error("Error checking pending invitations:", error);
        return { invitations: [] };
    }
}

/**
 * Get all invitations for the current user (pending, accepted, expired)
 */
export async function getUserInvitations() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { invitations: [] };
    }

    try {
        const invites = await db.query.invitation.findMany({
            where: eq(invitation.email, session.user.email),
            with: {
                organization: true,
            },
            orderBy: (invitation, { desc }) => [desc(invitation.createdAt)],
        });

        return { invitations: invites };
    } catch (error) {
        console.error("Error fetching user invitations:", error);
        return { invitations: [] };
    }
}
