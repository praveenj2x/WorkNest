"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { task, taskComment } from "@/db/schema";
import { eq, and, or, desc, isNull } from "drizzle-orm";

export async function createTask(data: {
  organizationId: string;
  teamId?: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: Date;
  assignedTo?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const [newTask] = await db
      .insert(task)
      .values({
        id: crypto.randomUUID(),
        organizationId: data.organizationId,
        teamId: data.teamId || null,
        title: data.title,
        description: data.description || null,
        priority: data.priority || "medium",
        dueDate: data.dueDate || null,
        assignedTo: data.assignedTo || null,
        createdBy: session.user.id,
        status: "todo",
      })
      .returning();

    return { success: true, task: newTask };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task" };
  }
}

export async function getOrganizationTasks(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", tasks: [] };
  }

  try {
    const tasks = await db.query.task.findMany({
      where: and(
        eq(task.organizationId, organizationId),
        isNull(task.teamId)
      ),
      with: {
        assignee: true,
        creator: true,
        comments: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(task.createdAt)],
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Error fetching organization tasks:", error);
    return { error: "Failed to fetch tasks", tasks: [] };
  }
}

export async function getTeamTasks(teamId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", tasks: [] };
  }

  try {
    const tasks = await db.query.task.findMany({
      where: eq(task.teamId, teamId),
      with: {
        assignee: true,
        creator: true,
        comments: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(task.createdAt)],
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Error fetching team tasks:", error);
    return { error: "Failed to fetch tasks", tasks: [] };
  }
}

export async function getMyTasks(organizationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", tasks: [] };
  }

  try {
    const tasks = await db.query.task.findMany({
      where: and(
        eq(task.organizationId, organizationId),
        or(
          eq(task.assignedTo, session.user.id),
          eq(task.createdBy, session.user.id)
        )
      ),
      with: {
        assignee: true,
        creator: true,
        team: true,
        comments: {
          with: {
            user: true,
          },
        },
      },
      orderBy: [desc(task.createdAt)],
    });

    return { success: true, tasks };
  } catch (error) {
    console.error("Error fetching my tasks:", error);
    return { error: "Failed to fetch tasks", tasks: [] };
  }
}

export async function getTaskById(taskId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", task: null };
  }

  try {
    const taskData = await db.query.task.findFirst({
      where: eq(task.id, taskId),
      with: {
        assignee: true,
        creator: true,
        team: true,
        organization: true,
        comments: {
          with: {
            user: true,
          },
          orderBy: [desc(taskComment.createdAt)],
        },
      },
    });

    if (!taskData) {
      return { error: "Task not found", task: null };
    }

    return { success: true, task: taskData };
  } catch (error) {
    console.error("Error fetching task:", error);
    return { error: "Failed to fetch task", task: null };
  }
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: Date | null;
    assignedTo?: string | null;
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const updates: any = { ...data, updatedAt: new Date() };

    // If status is being changed to completed, set completedAt
    if (data.status === "completed") {
      updates.completedAt = new Date();
    }

    await db.update(task).set(updates).where(eq(task.id, taskId));

    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Failed to update task" };
  }
}

export async function deleteTask(taskId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db.delete(task).where(eq(task.id, taskId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Failed to delete task" };
  }
}

export async function addTaskComment(taskId: string, comment: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await db.insert(taskComment).values({
      id: crypto.randomUUID(),
      taskId,
      userId: session.user.id,
      comment,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}
