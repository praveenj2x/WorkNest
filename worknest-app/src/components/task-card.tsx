"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateTask, deleteTask } from "@/actions/tasks";
import {
  Calendar,
  MoreVertical,
  User,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    createdAt: Date;
    assignee?: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    } | null;
    creator: {
      id: string;
      name: string;
      email: string;
    };
    team?: {
      id: string;
      name: string;
    } | null;
  };
  currentUserId: string;
  isAdmin?: boolean;
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  review: AlertCircle,
  completed: CheckCircle2,
};

const statusColors = {
  todo: "bg-gray-500/10 text-gray-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  review: "bg-purple-500/10 text-purple-500",
  completed: "bg-green-500/10 text-green-500",
};

export function TaskCard({ task, currentUserId, isAdmin = false }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle;

  const canEdit = isAdmin || task.creator.id === currentUserId || task.assignee?.id === currentUserId;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateTask(task.id, { status: newStatus });
      router.refresh();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    setLoading(true);
    try {
      await deleteTask(task.id);
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold leading-none tracking-tight">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                  Mark as To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("review")}>
                  Mark as In Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={statusColors[task.status as keyof typeof statusColors]}
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {task.status.replace("_", " ")}
          </Badge>
          <Badge
            variant="outline"
            className={priorityColors[task.priority as keyof typeof priorityColors]}
          >
            {task.priority}
          </Badge>
          {task.team && (
            <Badge variant="outline">
              {task.team.name}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          {task.assignee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.image || undefined} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{task.assignee.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-xs">Unassigned</span>
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : ""}`}>
            <Calendar className="h-4 w-4" />
            <span className="text-xs">
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
