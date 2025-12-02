# Task Management System - Complete Implementation

## ✅ What's Been Implemented

### Database Schema
- **task** table with:
  - Organization-wide tasks (teamId = null)
  - Team-specific tasks (teamId set)
  - Status tracking: todo, in_progress, review, completed
  - Priority levels: low, medium, high, urgent
  - Due dates
  - Assignment to specific users
  - Creator tracking
  
- **task_comment** table for:
  - Task discussions
  - User comments
  - Timestamp tracking

### Server Actions (`src/actions/tasks.ts`)
- `createTask()` - Create tasks for organization or team
- `getOrganizationTasks()` - Get org-wide tasks only
- `getTeamTasks()` - Get team-specific tasks
- `getMyTasks()` - Get tasks assigned to or created by user
- `getTaskById()` - Get single task with details
- `updateTask()` - Modify task details, status, assignment
- `deleteTask()` - Remove tasks
- `addTaskComment()` - Add comments to tasks

### Features
- Organization-level tasks (visible to all members)
- Team-level tasks (visible to team members)
- Task assignment to specific members
- Status workflow: Todo → In Progress → Review → Completed
- Priority levels with visual indicators
- Due date tracking
- Comment system for collaboration
- Task filtering by status, priority, assignee

## 📋 Pages to Create

### 1. Main Tasks Page
**File**: `src/app/(root)/dashboard/tasks/page.tsx`

```typescript
// Shows:
// - My Tasks (assigned to me)
// - Created by me
// - Statistics (todo, in progress, completed)
// - Quick filters
// - Create task button
```

### 2. Create Task Page
**File**: `src/app/(root)/dashboard/tasks/new/page.tsx`

```typescript
// Form with:
// - Title (required)
// - Description
// - Priority selector
// - Due date picker
// - Team selector (optional)
// - Assign to member
// - Status (default: todo)
```

### 3. Task Detail Page
**File**: `src/app/(root)/dashboard/tasks/[taskId]/page.tsx`

```typescript
// Shows:
// - Task details
// - Status update buttons
// - Priority badge
// - Assigned user
// - Due date
// - Comments section
// - Edit/delete buttons
```

### 4. Organization Tasks Page
**File**: `src/app/(root)/dashboard/tasks/organization/page.tsx`

```typescript
// Shows only org-wide tasks
// Filter by status, priority
// Assign tasks to members
```

## 🎯 Task Workflow

```
TODO → IN PROGRESS → REVIEW → COMPLETED
  ↓         ↓           ↓          ↓
Create   Start Work   Submit    Approve
```

## 🎨 Priority System

- **Urgent** (Red) - Immediate attention required
- **High** (Orange) - Important, do soon
- **Medium** (Blue) - Normal priority
- **Low** (Gray) - Can wait

## 👥 Assignment System

### Who Can Assign Tasks?
- **Owners & Admins**: Can assign to anyone
- **Team Leads**: Can assign within their team
- **Members**: Can create unassigned tasks

### Assignment Options
1. **Assign to specific member** - Task goes to that person
2. **Leave unassigned** - Anyone can pick it up
3. **Assign to self** - Take ownership immediately

## 📊 Task Statistics

Track:
- Total tasks
- Tasks by status (todo, in progress, review, completed)
- Tasks by priority
- Overdue tasks
- My tasks vs team tasks
- Completion rate

## 🔔 Task Features

### Status Management
```typescript
// Update task status
await updateTask(taskId, { status: "in_progress" });

// Auto-set completedAt when status = completed
```

### Comments
```typescript
// Add comment
await addTaskComment(taskId, "Working on this now");

// View all comments with user info
```

### Due Dates
```typescript
// Set due date
await createTask({
  // ...
  dueDate: new Date("2025-12-15"),
});

// Check overdue
const isOverdue = task.dueDate < new Date() && task.status !== "completed";
```

## 🎯 Use Cases

### 1. Project Management
```typescript
// Create project task
await createTask({
  organizationId,
  teamId: engineeringTeam.id,
  title: "Implement user authentication",
  description: "Add OAuth with Google and GitHub",
  priority: "high",
  dueDate: new Date("2025-12-10"),
  assignedTo: developerId,
});
```

### 2. Onboarding Checklist
```typescript
// Create onboarding tasks
const tasks = [
  "Complete profile",
  "Read company handbook",
  "Setup development environment",
  "Meet the team",
];

for (const title of tasks) {
  await createTask({
    organizationId,
    title,
    priority: "medium",
    assignedTo: newEmployeeId,
  });
}
```

### 3. Recruitment Tasks
```typescript
// Create interview task
await createTask({
  organizationId,
  title: `Interview: ${candidate.name}`,
  description: `Technical interview for ${position}`,
  priority: "high",
  dueDate: interviewDate,
  assignedTo: interviewerId,
});
```

## 🔐 Permissions

### Organization Tasks
- **Create**: All members
- **View**: All members
- **Assign**: Owner, Admin
- **Edit**: Creator, Assignee, Owner, Admin
- **Delete**: Creator, Owner, Admin

### Team Tasks
- **Create**: Team members
- **View**: Team members only
- **Assign**: Team lead, Owner, Admin
- **Edit**: Creator, Assignee, Team lead, Owner, Admin
- **Delete**: Creator, Team lead, Owner, Admin

## 📱 UI Components Needed

### Task Card
```typescript
<TaskCard
  task={task}
  onStatusChange={handleStatusChange}
  onAssign={handleAssign}
/>
```

### Task Form
```typescript
<TaskForm
  organizationId={orgId}
  teams={teams}
  members={members}
  onSubmit={handleSubmit}
/>
```

### Task List
```typescript
<TaskList
  tasks={tasks}
  filter={filter}
  onTaskClick={handleTaskClick}
/>
```

### Status Badge
```typescript
<StatusBadge status={task.status} />
// Shows: Todo, In Progress, Review, Completed
```

### Priority Badge
```typescript
<PriorityBadge priority={task.priority} />
// Shows: Low, Medium, High, Urgent with colors
```

## 🔄 Integration Points

### With Calendar
```typescript
// Create calendar event for task deadline
if (task.dueDate) {
  await createEvent({
    organizationId,
    title: `Deadline: ${task.title}`,
    startTime: task.dueDate,
    endTime: task.dueDate,
    eventType: "deadline",
    color: "rose",
  });
}
```

### With Teams
```typescript
// Show team tasks on team page
const teamTasks = await getTeamTasks(teamId);

<TeamTasksSection tasks={teamTasks} />
```

### With Dashboard
```typescript
// Show my tasks on dashboard
const myTasks = await getMyTasks(organizationId);
const urgent = myTasks.filter(t => t.priority === "urgent");

<DashboardWidget title="Urgent Tasks" tasks={urgent} />
```

## 📊 Database Structure

```
task
├── id (UUID)
├── organizationId (FK) - Required
├── teamId (FK) - Optional (null = org-wide)
├── title
├── description
├── status (todo, in_progress, review, completed)
├── priority (low, medium, high, urgent)
├── dueDate
├── assignedTo (FK to user) - Optional
├── createdBy (FK to user)
├── timestamps
└── completedAt

task_comment
├── id (UUID)
├── taskId (FK)
├── userId (FK)
├── comment
└── createdAt
```

## 🎯 Quick Implementation Steps

### Step 1: Create Task List Page
```bash
src/app/(root)/dashboard/tasks/page.tsx
```

### Step 2: Create Task Form
```bash
src/components/create-task-form.tsx
```

### Step 3: Create Task Detail Page
```bash
src/app/(root)/dashboard/tasks/[taskId]/page.tsx
```

### Step 4: Add to Team Pages
```typescript
// In team detail page
const teamTasks = await getTeamTasks(teamId);
<TaskList tasks={teamTasks} />
```

## ✨ Status

- ✅ Database schema created
- ✅ Server actions implemented
- ✅ Sidebar menu updated
- ⏳ Task list page (needs creation)
- ⏳ Create task form (needs creation)
- ⏳ Task detail page (needs creation)
- ⏳ Task components (needs creation)

---

**Foundation Complete!** Ready to build the UI pages.
