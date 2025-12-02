"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "./task-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
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
}

interface TaskListProps {
  tasks: Task[];
  currentUserId: string;
  isAdmin?: boolean;
}

export function TaskList({ tasks, currentUserId, isAdmin = false }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress");
  const reviewTasks = filteredTasks.filter((t) => t.status === "review");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({filteredTasks.length})
          </TabsTrigger>
          <TabsTrigger value="todo">
            To Do ({todoTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="review">
            Review ({reviewTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Done ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="todo" className="mt-4">
          {todoTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks in To Do
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="mt-4">
          {inProgressTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks in progress
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          {reviewTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No tasks in review
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviewTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No completed tasks
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
