"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { member } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function checkUserPermission(
  organizationId: string,
  requiredRoles: string[] = ["owner", "admin"]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { authorized: false, error: "Unauthorized" };
  }

  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.userId, session.user.id),
      eq(member.organizationId, organizationId)
    ),
  });

  if (!membership) {
    return { authorized: false, error: "Not a member of this organization" };
  }

  if (!requiredRoles.includes(membership.role)) {
    return {
      authorized: false,
      error: `Requires one of these roles: ${requiredRoles.join(", ")}`,
    };
  }

  return { authorized: true, membership, session };
}

export async function getCurrentUserMembership(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.userId, session.user.id),
      eq(member.organizationId, organizationId)
    ),
  });

  return membership;
}
