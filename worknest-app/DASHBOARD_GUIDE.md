# HR Management Dashboard Guide

## Overview

Your HR management software now includes a complete dashboard with:
- **Sidebar Navigation** with organization branding
- **Team Management** - Create and manage teams
- **Member Management** - Invite members and manage roles
- **Role-Based Access Control** - Owner, Admin, Member roles
- **Modern UI** using shadcn/ui components

## Features Implemented

### 1. Dashboard Layout with Sidebar

**Location**: `src/app/(root)/dashboard/layout.tsx`

- Persistent sidebar across all dashboard pages
- Organization branding in header
- User profile dropdown in footer
- Responsive design with mobile support

**Sidebar Menu**:
- Dashboard (Overview)
- Teams
- Members
- Settings

### 2. Dashboard Overview

**Route**: `/dashboard`

Shows at-a-glance metrics:
- Total teams count
- Total members count
- Pending invitations
- Recent teams list
- Recent members list

### 3. Team Management

**Route**: `/dashboard/teams`

**Features**:
- View all teams in card grid
- Create new teams (Owner/Admin only)
- View team details
- See member count per team

**Team Creation**:
- Team name (required)
- Team description (optional)
- Automatic validation

**Individual Team View**: `/dashboard/teams/[teamId]`
- Team details
- List of team members
- Member roles within team

### 4. Member Management

**Route**: `/dashboard/members`

**Features**:
- View all organization members
- Invite new members via email
- Update member roles (Owner/Admin only)
- See member details (name, email, role)

**Roles**:
- **Owner**: Full control, can manage everything
- **Admin**: Can create teams, invite members, manage roles
- **Member**: Basic access

**Role Management**:
- Dropdown to change roles
- Only Owner/Admin can change roles
- Cannot change your own role
- Real-time updates

### 5. Member Invitations

**Features**:
- Send email invitations via Resend
- Add multiple emails at once
- 7-day expiration on invites
- Professional email templates

### 6. Settings Page

**Route**: `/dashboard/settings`

**Sections**:
- Organization details (name, slug, created date)
- User profile information
- Danger zone (future: delete organization)

## Components Created

### UI Components

1. **AppSidebar** (`src/components/app-sidebar.tsx`)
   - Main navigation sidebar
   - Organization branding
   - User profile dropdown
   - Sign out functionality

2. **CreateTeamDialog** (`src/components/create-team-dialog.tsx`)
   - Modal for creating teams
   - Form validation
   - Error handling

3. **InviteMemberDialog** (`src/components/invite-member-dialog.tsx`)
   - Modal for inviting members
   - Multiple email inputs
   - Dynamic form fields

4. **MemberRoleSelect** (`src/components/member-role-select.tsx`)
   - Dropdown for changing member roles
   - Permission checks
   - Optimistic updates

### Server Actions

**File**: `src/actions/teams.ts`

- `createTeam()` - Create new team
- `getOrganizationTeams()` - Fetch all teams
- `addMemberToTeam()` - Add member to team
- `removeMemberFromTeam()` - Remove member from team
- `updateMemberRole()` - Change member role
- `getOrganizationMembers()` - Fetch all members

## User Flow

### For Organization Owners/Admins

1. **After Login** → Dashboard overview
2. **Create Teams** → Navigate to Teams → Click "Create Team"
3. **Invite Members** → Navigate to Members → Click "Invite Members"
4. **Manage Roles** → Navigate to Members → Use role dropdown
5. **View Team Details** → Navigate to Teams → Click "View" on any team

### For Regular Members

1. **After Login** → Dashboard overview
2. **View Teams** → See teams they're part of
3. **View Members** → See all organization members
4. **Limited Actions** → Cannot create teams or change roles

## Permission System

### Owner
- Create/delete organization
- Create teams
- Invite members
- Manage all roles
- Full access to settings

### Admin
- Create teams
- Invite members
- Manage member roles (except owners)
- View all data

### Member
- View teams
- View members
- Basic dashboard access
- Cannot manage roles or invite

## Database Schema

The system uses Better Auth's organization plugin with these tables:

- `organization` - Organization details
- `member` - Organization membership with roles
- `invitation` - Pending member invitations
- `user` - User accounts
- `session` - User sessions

## API Integration

### Better Auth Organization Plugin

The dashboard integrates with Better Auth's organization features:

```typescript
// Create team
await auth.api.createTeam({
  headers: await headers(),
  body: { organizationId, name }
});

// Update member role
await auth.api.updateMemberRole({
  headers: await headers(),
  body: { organizationId, memberId, role }
});
```

## Styling

Uses **shadcn/ui** components with Tailwind CSS:
- Consistent design system
- Dark mode support (if configured)
- Responsive layouts
- Accessible components

## Next Steps (Optional Enhancements)

1. **Team Details Enhancement**
   - Add/remove members from teams
   - Team-specific permissions
   - Team activity logs

2. **Advanced Member Management**
   - Bulk invite via CSV
   - Member search/filter
   - Activity tracking

3. **Invitation System**
   - Accept invitation page
   - Resend invitations
   - Revoke invitations

4. **Analytics Dashboard**
   - Team performance metrics
   - Member activity charts
   - Growth statistics

5. **Notifications**
   - Real-time notifications
   - Email digests
   - Activity feed

6. **Organization Settings**
   - Update organization details
   - Custom branding
   - Billing integration

## Troubleshooting

### Teams not showing?
- Check Better Auth organization plugin is properly configured
- Verify database migrations are up to date
- Check console for API errors

### Can't change roles?
- Verify you're logged in as Owner or Admin
- Check member permissions in database
- Ensure you're not trying to change your own role

### Invitations not sending?
- Verify RESEND_API_KEY is set in .env
- Check Resend dashboard for logs
- Verify EMAIL_FROM domain is verified

### Sidebar not showing?
- Check dashboard layout is wrapping pages
- Verify SidebarProvider is configured
- Check for console errors

## Development Commands

```bash
# Start development server
npm run dev

# Run database migrations
npx drizzle-kit push

# Check TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .
```

## File Structure

```
src/
├── app/
│   └── (root)/
│       └── dashboard/
│           ├── layout.tsx          # Dashboard layout with sidebar
│           ├── page.tsx             # Dashboard overview
│           ├── teams/
│           │   ├── page.tsx         # Teams list
│           │   └── [teamId]/
│           │       └── page.tsx     # Team details
│           ├── members/
│           │   └── page.tsx         # Members management
│           └── settings/
│               └── page.tsx         # Settings page
├── components/
│   ├── app-sidebar.tsx              # Main sidebar component
│   ├── create-team-dialog.tsx       # Team creation modal
│   ├── invite-member-dialog.tsx     # Member invitation modal
│   ├── member-role-select.tsx       # Role management dropdown
│   └── ui/                          # shadcn/ui components
└── actions/
    ├── organization.ts              # Organization actions
    └── teams.ts                     # Team & member actions
```

## Security Considerations

- All server actions verify authentication
- Role checks before sensitive operations
- SQL injection protection via Drizzle ORM
- CSRF protection via Better Auth
- Secure session management

## Performance

- Server-side rendering for initial load
- Optimistic UI updates for role changes
- Efficient database queries with relations
- Minimal client-side JavaScript

---

**Built with**: Next.js 16, Better Auth, Drizzle ORM, shadcn/ui, Tailwind CSS
