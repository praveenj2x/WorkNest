import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { member, organization } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrganizationTasks } from "@/actions/tasks";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { TaskList } from "@/components/task-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrganizationTasksPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { orgId } = await params;

  // Get organization details
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  });

  if (!org) {
    redirect("/dashboard");
  }

  // Check if user is a member
  const membership = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, orgId),
      eq(member.userId, session.user.id)
    ),
  });

  if (!membership) {
    redirect("/dashboard");
  }

  const isAdmin = membership.role === "admin" || membership.role === "owner";

  // Get all organization members for task assignment
  const members = await db.query.member.findMany({
    where: eq(member.organizationId, orgId),
    with: {
      user: true,
    },
  });

  const membersList = members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
  }));

  // Get organization tasks (tasks not assigned to any team)
  const { tasks } = await getOrganizationTasks(orgId);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organization Tasks</h2>
          <p className="text-muted-foreground">
            Manage tasks for {org.name}
          </p>
        </div>
        {isAdmin && (
          <CreateTaskDialog
            organizationId={orgId}
            members={membersList}
            isTeamTask={false}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "todo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "in_progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((t) => t.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <TaskList
        tasks={tasks}
        currentUserId={session.user.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
