# Task Management System

## Overview
The WorkNest task management system allows you to create, assign, and manage tasks at both the organization and team levels.

## Features

### Organization Tasks
- **Location**: `/dashboard/[orgId]/tasks`
- **Access**: All organization members can view organization tasks
- **Permissions**: Only admins can create organization-level tasks
- **Assignment**: Tasks can be assigned to any member of the organization

### Team Tasks
- **Location**: `/dashboard/[orgId]/teams/[teamId]/tasks`
- **Access**: Only team members can view team tasks
- **Permissions**: All team members can create tasks for their team
- **Assignment**: Tasks can be assigned to any team member

## Task Properties

Each task includes:
- **Title**: Required task name
- **Description**: Optional detailed description
- **Status**: todo, in_progress, review, completed
- **Priority**: low, medium, high, urgent
- **Due Date**: Optional deadline
- **Assignee**: Optional team/organization member

## Task Management

### Creating Tasks

**Organization Tasks (Admin only):**
1. Navigate to `/dashboard/[orgId]/tasks`
2. Click "Create Task"
3. Fill in task details
4. Assign to any organization member (optional)
5. Click "Create Task"

**Team Tasks (Any team member):**
1. Navigate to team page `/dashboard/teams/[teamId]`
2. Click "View Tasks"
3. Click "Create Task"
4. Fill in task details
5. Assign to any team member (optional)
6. Click "Create Task"

### Updating Tasks

Any user who can edit a task (creator, assignee, or admin) can:
- Change task status via dropdown menu
- Update task details
- Delete the task

### Task Filters

The task list includes:
- **Search**: Filter by title or description
- **Priority Filter**: Filter by priority level
- **Status Filter**: Filter by task status
- **Status Tabs**: View tasks grouped by status

## Navigation

### Sidebar
- Click "Tasks" in the sidebar to view organization tasks

### Team Page
- Click "View Tasks" button on any team detail page to view team-specific tasks

## Permissions

### Organization Tasks
- **View**: All organization members
- **Create**: Admin/Owner only
- **Edit**: Admin, task creator, or assignee
- **Delete**: Admin, task creator, or assignee

### Team Tasks
- **View**: Team members only
- **Create**: Any team member
- **Edit**: Team lead, task creator, or assignee
- **Delete**: Team lead, task creator, or assignee

## Statistics

Both organization and team task pages show:
- Total tasks
- Tasks in "To Do" status
- Tasks "In Progress"
- Completed tasks

## Server Actions

The following server actions are available in `/src/actions/tasks.ts`:

- `createTask()`: Create a new task
- `getOrganizationTasks()`: Get all organization-level tasks
- `getTeamTasks()`: Get all tasks for a specific team
- `getMyTasks()`: Get tasks assigned to or created by current user
- `getTaskById()`: Get a specific task with full details
- `updateTask()`: Update task properties
- `deleteTask()`: Delete a task
- `addTaskComment()`: Add a comment to a task

## Components

### UI Components
- `CreateTaskDialog`: Dialog for creating new tasks
- `TaskCard`: Card component displaying task information
- `TaskList`: List view with filtering and tabs

### Location
All task components are in `/src/components/`:
- `create-task-dialog.tsx`
- `task-card.tsx`
- `task-list.tsx`

## Database Schema

Tasks are stored in the `task` table with the following structure:
- Organization ID (required)
- Team ID (optional - null for organization tasks)
- Title, description, status, priority
- Due date, assigned user, creator
- Timestamps (created, updated, completed)

Task comments are stored in the `task_comment` table.
