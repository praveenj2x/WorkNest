# Calendar System - Implementation Complete

## ✅ What's Been Implemented

### Database Schema
- **calendar_event** table with:
  - Organization-wide events (teamId = null)
  - Team-specific events (teamId set)
  - Event types: meeting, deadline, task, holiday
  - Color coding support
  - All-day event support
  - Location tracking
  
- **event_attendee** table for:
  - Tracking event participants
  - RSVP status (pending, accepted, declined)

### Server Actions (`src/actions/calendar.ts`)
- `createEvent()` - Create events for organization or team
- `getOrganizationEvents()` - Get org-wide events only
- `getTeamEvents()` - Get team-specific events
- `getAllEventsForUser()` - Get all events user can see
- `updateEvent()` - Modify event details
- `deleteEvent()` - Remove events
- `updateAttendeeStatus()` - Accept/decline invitations

### Calendar Pages
- **Main Calendar** (`/dashboard/calendar`) - Overview with stats
- **Organization Calendar** - Org-wide events (to be created)
- **Team Calendars** - Accessible from team detail pages

### Features
- Organization-level calendar (visible to all members)
- Team-level calendars (visible to team members)
- Event types: Meetings, Deadlines, Tasks, Holidays
- Color-coded events
- Attendee management
- RSVP functionality

## 🎯 How to Use

### Create Organization Event
1. Go to Calendar
2. Click "New Event"
3. Fill in details
4. Leave "Team" empty for org-wide event
5. Add attendees (optional)

### Create Team Event
1. Go to Team detail page
2. Click "New Event" (to be added)
3. Event automatically assigned to team
4. Only team members can see it

### View Events
- **All Events**: `/dashboard/calendar`
- **Org Events**: `/dashboard/calendar/organization`
- **Team Events**: From team detail page

## 📋 Next Steps to Complete

### 1. Create New Event Page
File: `src/app/(root)/dashboard/calendar/new/page.tsx`

```typescript
// Form to create events with:
// - Title, description
// - Start/end time
// - Location
// - Event type selector
// - Team selector (optional)
// - Attendee selector
// - Color picker
```

### 2. Add Calendar to Team Pages
Update `src/app/(root)/dashboard/teams/[teamId]/page.tsx`:
- Add "Calendar" tab
- Show team-specific events
- Button to create team event

### 3. Organization Calendar Page
File: `src/app/(root)/dashboard/calendar/organization/page.tsx`
- Show only org-wide events
- Filter by event type
- Month/week/day views

### 4. Event Detail Page
File: `src/app/(root)/dashboard/calendar/[eventId]/page.tsx`
- View full event details
- See attendees and their status
- Edit/delete buttons (for creator)
- RSVP buttons (for attendees)

## 🔧 Integration Points

### With Teams
```typescript
// In team detail page, add:
const teamEvents = await getTeamEvents(teamId);

// Display team calendar
<TeamCalendar events={teamEvents} />
```

### With Recruitment
```typescript
// Create interview events:
await createEvent({
  organizationId,
  title: `Interview: ${candidate.name}`,
  eventType: "meeting",
  startTime: interviewDate,
  // ...
});
```

### With Dashboard
```typescript
// Show upcoming events on dashboard:
const upcomingEvents = events
  .filter(e => new Date(e.startTime) > new Date())
  .slice(0, 5);
```

## 📊 Database Structure

```
calendar_event
├── id (UUID)
├── organizationId (FK) - Required
├── teamId (FK) - Optional (null = org-wide)
├── title
├── description
├── startTime
├── endTime
├── location
├── color (blue, emerald, violet, orange, rose)
├── isAllDay (boolean)
├── eventType (meeting, deadline, task, holiday)
├── createdBy (FK)
└── timestamps

event_attendee
├── id (UUID)
├── eventId (FK)
├── userId (FK)
├── status (pending, accepted, declined)
└── addedAt
```

## 🎨 Event Colors

- **Blue**: General meetings, planning
- **Emerald**: Company events, all-hands
- **Violet**: Interviews, 1-on-1s
- **Orange**: Team activities, social
- **Rose**: Personal time, holidays

## 🔐 Permissions

### Organization Events
- **Create**: Owner, Admin
- **View**: All members
- **Edit/Delete**: Creator or Owner/Admin

### Team Events
- **Create**: Team members
- **View**: Team members only
- **Edit/Delete**: Creator or Owner/Admin

## 📱 UI Components Needed

### Calendar Grid Component
```typescript
// Monthly calendar view
<CalendarGrid 
  events={events}
  onDateClick={handleDateClick}
  onEventClick={handleEventClick}
/>
```

### Event Form Component
```typescript
<EventForm
  organizationId={orgId}
  teams={teams}
  members={members}
  onSubmit={handleSubmit}
/>
```

### Event Card Component
```typescript
<EventCard
  event={event}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onRSVP={handleRSVP}
/>
```

## 🚀 Quick Implementation Guide

### Step 1: Create Event Form
```bash
# Create the new event page
src/app/(root)/dashboard/calendar/new/page.tsx
```

### Step 2: Add to Team Pages
```typescript
// In team detail page, add calendar section
<Card>
  <CardHeader>
    <CardTitle>Team Calendar</CardTitle>
  </CardHeader>
  <CardContent>
    <CalendarView events={teamEvents} />
    <Button onClick={createTeamEvent}>
      New Team Event
    </Button>
  </CardContent>
</Card>
```

### Step 3: Event Detail Page
```bash
# Create event detail page
src/app/(root)/dashboard/calendar/[eventId]/page.tsx
```

## 📈 Usage Examples

### Create Meeting
```typescript
await createEvent({
  organizationId: "org-123",
  title: "Weekly Standup",
  startTime: new Date("2025-12-02T09:00:00"),
  endTime: new Date("2025-12-02T09:30:00"),
  eventType: "meeting",
  color: "blue",
  attendeeIds: ["user1", "user2"],
});
```

### Create Team Deadline
```typescript
await createEvent({
  organizationId: "org-123",
  teamId: "team-456",
  title: "Project Deadline",
  startTime: new Date("2025-12-15T17:00:00"),
  endTime: new Date("2025-12-15T17:00:00"),
  eventType: "deadline",
  color: "rose",
  isAllDay: true,
});
```

### Get Team Calendar
```typescript
const { events } = await getTeamEvents(
  "team-456",
  startOfMonth,
  endOfMonth
);
```

## 🎯 Benefits

1. **Centralized Scheduling**: All org and team events in one place
2. **Team Coordination**: Each team has its own calendar
3. **Deadline Tracking**: Track project deadlines
4. **Interview Scheduling**: Integrate with recruitment
5. **RSVP System**: Know who's attending
6. **Color Coding**: Visual organization
7. **Flexible Views**: Org-wide or team-specific

## 📝 Status

- ✅ Database schema created
- ✅ Server actions implemented
- ✅ Main calendar page created
- ✅ Calendar view component created
- ✅ Sidebar menu updated
- ⏳ Event creation form (needs implementation)
- ⏳ Event detail page (needs implementation)
- ⏳ Team calendar integration (needs implementation)
- ⏳ Organization calendar page (needs implementation)

---

**Ready to use!** The foundation is complete. Add the remaining pages to have a fully functional calendar system.
