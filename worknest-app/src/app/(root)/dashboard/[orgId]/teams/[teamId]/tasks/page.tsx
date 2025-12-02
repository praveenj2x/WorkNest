import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { team, teamMember } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getTeamTasks } from "@/actions/tasks";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { TaskList } from "@/components/task-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TeamTasksPage({
  params,
}: {
  params: Promise<{ orgId: string; teamId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { orgId, teamId } = await params;

  // Get team details
  const teamData = await db.query.team.findFirst({
    where: eq(team.id, teamId),
    with: {
      organization: true,
      creator: true,
    },
  });

  if (!teamData || teamData.organizationId !== orgId) {
    redirect("/dashboard");
  }

  // Check if user is a team member
  const membership = await db.query.teamMember.findFirst({
    where: and(
      eq(teamMember.teamId, teamId),
      eq(teamMember.userId, session.user.id)
    ),
  });

  if (!membership) {
    redirect(`/dashboard/${orgId}/teams`);
  }

  const isTeamLead = membership.role === "lead";

  // Get all team members for task assignment
  const members = await db.query.teamMember.findMany({
    where: eq(teamMember.teamId, teamId),
    with: {
      user: true,
    },
  });

  const membersList = members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
  }));

  // Get team tasks
  const { tasks } = await getTeamTasks(teamId);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{teamData.name} Tasks</h2>
          <p className="text-muted-foreground">
            {teamData.description || "Manage tasks for your team"}
          </p>
        </div>
        <CreateTaskDialog
          organizationId={orgId}
          teamId={teamId}
          members={membersList}
          isTeamTask={true}
        />
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
        isAdmin={isTeamLead}
      />
    </div>
  );
}
