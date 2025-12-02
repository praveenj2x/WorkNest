"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { member, team, teamMember } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function createTeam(
  organizationId: string,
  name: string,
  description?: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  // Verify user is owner/admin of the organization
  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.userId, session.user.id),
      eq(member.organizationId, organizationId)
    ),
  });

  if (
    !membership ||
    (membership.role !== "owner" && membership.role !== "admin")
  ) {
    return { error: "Only owners and admins can create teams" };
  }

  try {
    // Create team in our custom table
    const [newTeam] = await db
      .insert(team)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        name,
        description: description || null,
        createdBy: session.user.id,
      })
      .returning();

    return { success: true, team: newTeam };
  } catch (error) {
    console.error("Error creating team:", error);
    return { error: "Failed to create team" };
  }
}

export async function getOrganizationTeams(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", teams: [] };
  }

  try {
    const teams = await db.query.team.findMany({
      where: eq(team.organizationId, organizationId),
      with: {
        creator: true,
        members: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(team.createdAt)],
    });

    return { success: true, teams };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return { error: "Failed to fetch teams", teams: [] };
  }
}

export async function getTeamById(teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", team: null };
  }

  try {
    const teamData = await db.query.team.findFirst({
      where: eq(team.id, teamId),
      with: {
        creator: true,
        organization: true,
        members: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!teamData) {
      console.log(`Team not found with ID: ${teamId}`);
      return { error: "Team not found", team: null };
    }

    return { success: true, team: teamData };
  } catch (error) {
    console.error("Error fetching team:", error);
    return { error: "Failed to fetch team", team: null };
  }
}

export async function addMemberToTeam(
  teamId: string,
  userId: string,
  role: string = "member"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // Check if user is already a team member
    const existingMember = await db.query.teamMember.findFirst({
      where: and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)),
    });

    if (existingMember) {
      return { error: "User is already a team member" };
    }

    await db.insert(teamMember).values({
      id: crypto.randomUUID(),
      teamId,
      userId,
      role,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding member to team:", error);
    return { error: "Failed to add member to team" };
  }
}

export async function removeMemberFromTeam(teamId: string, userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .delete(teamMember)
      .where(
        and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId))
      );

    return { success: true };
  } catch (error) {
    console.error("Error removing member from team:", error);
    return { error: "Failed to remove member from team" };
  }
}

export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db
      .update(teamMember)
      .set({ role })
      .where(
        and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId))
      );

    return { success: true };
  } catch (error) {
    console.error("Error updating team member role:", error);
    return { error: "Failed to update team member role" };
  }
}

export async function updateTeam(
  teamId: string,
  name: string,
  description?: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // Get team to check permissions
    const teamData = await db.query.team.findFirst({
      where: eq(team.id, teamId),
    });

    if (!teamData) {
      return { error: "Team not found" };
    }

    // Check if user is owner/admin of the organization
    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, teamData.organizationId)
      ),
    });

    if (
      !membership ||
      (membership.role !== "owner" && membership.role !== "admin")
    ) {
      return { error: "Only owners and admins can update teams" };
    }

    await db
      .update(team)
      .set({
        name,
        description: description || null,
      })
      .where(eq(team.id, teamId));

    return { success: true };
  } catch (error) {
    console.error("Error updating team:", error);
    return { error: "Failed to update team" };
  }
}

export async function deleteTeam(teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // Get team to check permissions
    const teamData = await db.query.team.findFirst({
      where: eq(team.id, teamId),
    });

    if (!teamData) {
      return { error: "Team not found" };
    }

    // Check if user is owner/admin of the organization
    const membership = await db.query.member.findFirst({
      where: and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, teamData.organizationId)
      ),
    });

    if (
      !membership ||
      (membership.role !== "owner" && membership.role !== "admin")
    ) {
      return { error: "Only owners and admins can delete teams" };
    }

    await db.delete(team).where(eq(team.id, teamId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { error: "Failed to delete team" };
  }
}

export async function updateMemberRole(
  organizationId: string,
  memberId: string,
  role: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  // Verify user is owner/admin
  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.userId, session.user.id),
      eq(member.organizationId, organizationId)
    ),
  });

  if (
    !membership ||
    (membership.role !== "owner" && membership.role !== "admin")
  ) {
    return { error: "Only owners and admins can update roles" };
  }

  try {
    await db
      .update(member)
      .set({ role })
      .where(eq(member.id, memberId));

    return { success: true };
  } catch (error) {
    console.error("Error updating member role:", error);
    return { error: "Failed to update member role" };
  }
}

export async function getOrganizationMembers(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", members: [] };
  }

  try {
    const members = await db.query.member.findMany({
      where: eq(member.organizationId, organizationId),
      with: {
        user: true,
      },
    });

    return { success: true, members };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { error: "Failed to fetch members", members: [] };
  }
}
