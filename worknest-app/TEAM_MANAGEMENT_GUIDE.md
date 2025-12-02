# Team Management System - Complete Guide

## Overview

Your HR management system now has a fully functional team management system with the ability to create teams, add/remove members, edit team details, and delete teams.

## Features Implemented

### 1. Team Creation ✅
- Owners and Admins can create teams
- Team name (required)
- Team description (optional)
- Automatic creator tracking
- Timestamp tracking

### 2. Team List View ✅
- View all teams in organization
- Team cards showing:
  - Team name and description
  - Member count
  - Quick access to team details
- Empty state with call-to-action

### 3. Team Detail Page ✅

**Information Displayed:**
- Team name and description
- Creator information
- Creation date
- Total member count
- List of all team members with:
  - Avatar
  - Name and email
  - Team role (Lead/Member)

**Actions Available (Owner/Admin only):**
- **Add Members**: Add existing organization members to team
- **Edit Team**: Update team name and description
- **Delete Team**: Remove team entirely
- **Remove Members**: Remove individual members from team

### 4. Add Team Members

**Two Ways to Add:**

#### Option 1: Add Existing Organization Members
1. Click "Add Member" button
2. Select from dropdown of organization members
3. Choose team role (Lead or Member)
4. Member is instantly added to team

**Features:**
- Only shows members not already in team
- Prevents duplicate additions
- Role selection (Lead/Member)
- Instant refresh after adding

#### Option 2: Invite New People (Future Enhancement)
- Can be added to invite people directly to team
- Would send email invitation
- New user joins organization and team simultaneously

### 5. Edit Team

**Editable Fields:**
- Team name
- Team description

**Process:**
1. Click "Edit Team" button
2. Update fields in modal
3. Save changes
4. Page refreshes with new data

### 6. Delete Team

**Safety Features:**
- Confirmation dialog
- Shows team name for verification
- Cannot be undone warning
- Redirects to teams list after deletion

**What Happens:**
- Team is deleted from database
- All team memberships are removed (cascade delete)
- Team members remain in organization

### 7. Remove Team Members

**Process:**
1. Click X button next to member
2. Confirm removal
3. Member removed from team
4. Member remains in organization

**Restrictions:**
- Only Owner/Admin can remove members
- Cannot remove yourself (future enhancement)

## Database Schema

### Team Table
```typescript
{
  id: string (UUID)
  organizationId: string (FK)
  name: string
  description: string (nullable)
  createdAt: timestamp
  createdBy: string (FK to user)
}
```

### Team Member Table
```typescript
{
  id: string (UUID)
  teamId: string (FK)
  userId: string (FK)
  role: string (lead|member)
  joinedAt: timestamp
}
```

## Server Actions

### Team Management

**`createTeam(organizationId, name, description)`**
- Creates new team
- Requires Owner/Admin role
- Returns team data

**`getOrganizationTeams(organizationId)`**
- Fetches all teams for organization
- Includes creator and members
- Ordered by creation date (newest first)

**`getTeamById(teamId)`**
- Fetches single team with full details
- Includes creator, organization, and members
- Returns error if not found

**`updateTeam(teamId, name, description)`**
- Updates team information
- Requires Owner/Admin role
- Validates permissions

**`deleteTeam(teamId)`**
- Deletes team and all memberships
- Requires Owner/Admin role
- Cascade deletes team members

### Team Member Management

**`addMemberToTeam(teamId, userId, role)`**
- Adds organization member to team
- Prevents duplicate additions
- Default role: "member"

**`removeMemberFromTeam(teamId, userId)`**
- Removes member from team
- Member stays in organization
- Instant update

**`updateTeamMemberRole(teamId, userId, role)`**
- Changes member's team role
- Between "lead" and "member"

## User Permissions

### Owner & Admin
- ✅ Create teams
- ✅ Edit teams
- ✅ Delete teams
- ✅ Add members to teams
- ✅ Remove members from teams
- ✅ View all teams
- ✅ View team details

### Regular Members
- ✅ View teams they're part of
- ✅ View team details
- ❌ Cannot create teams
- ❌ Cannot edit teams
- ❌ Cannot delete teams
- ❌ Cannot manage team members

## UI Components

### Dialogs
- **CreateTeamDialog**: Create new team
- **AddTeamMemberDialog**: Add members with role selection
- **EditTeamDialog**: Update team info
- **DeleteTeamDialog**: Confirm team deletion

### Buttons
- **RemoveTeamMemberButton**: Remove individual members

### Pages
- **Teams List** (`/dashboard/teams`)
- **Team Detail** (`/dashboard/teams/[teamId]`)

## User Flow

### Creating a Team
1. Navigate to Teams page
2. Click "Create Team"
3. Enter name and description
4. Submit
5. Team appears in list

### Adding Members to Team
1. Open team detail page
2. Click "Add Member"
3. Select member from dropdown
4. Choose role (Lead/Member)
5. Click "Add Member"
6. Member appears in list

### Editing a Team
1. Open team detail page
2. Click "Edit Team"
3. Update name/description
4. Click "Save Changes"
5. Page refreshes with updates

### Removing a Member
1. Open team detail page
2. Click X next to member
3. Confirm removal
4. Member removed from list

### Deleting a Team
1. Open team detail page
2. Click "Delete Team"
3. Confirm deletion
4. Redirected to teams list

## Team Roles

### Team Lead
- Designated leader of the team
- Same permissions as regular member (for now)
- Visual distinction with role badge
- Future: Could have additional permissions

### Team Member
- Regular team member
- Can view team information
- Part of team activities

## Integration with Organization

### Relationship
- Teams belong to organizations
- Team members must be organization members first
- Removing from organization removes from all teams
- Organization roles (Owner/Admin) control team management

### Member Flow
1. User joins organization (via invitation)
2. User becomes organization member
3. Owner/Admin adds user to teams
4. User is now part of specific teams

## Best Practices

### Team Structure
- Create teams based on departments or projects
- Use descriptive names (e.g., "Engineering", "Marketing")
- Add descriptions to clarify team purpose
- Assign team leads for each team

### Member Management
- Add members to relevant teams only
- Use team roles appropriately
- Remove members when they change roles
- Keep team sizes manageable

### Permissions
- Only give Owner/Admin to trusted users
- Regular members can view but not modify
- Review team memberships regularly

## Future Enhancements

### Phase 1 (Recommended)
- [ ] Team-specific permissions
- [ ] Team lead can manage their own team
- [ ] Bulk add members
- [ ] Team activity logs
- [ ] Team statistics

### Phase 2 (Advanced)
- [ ] Team channels/discussions
- [ ] Team files and documents
- [ ] Team calendar
- [ ] Team goals and OKRs
- [ ] Team performance metrics
- [ ] Sub-teams or team hierarchy

### Phase 3 (Enterprise)
- [ ] Cross-organization teams
- [ ] External team members (contractors)
- [ ] Team templates
- [ ] Automated team creation
- [ ] Integration with project management tools

## Troubleshooting

### Can't create team
- Check you're Owner or Admin
- Verify organization exists
- Check database connection

### Can't add member to team
- Verify member is in organization
- Check member isn't already in team
- Verify permissions

### Team not showing
- Check organization ID matches
- Verify team wasn't deleted
- Refresh the page

### Can't remove member
- Check you're Owner or Admin
- Verify member is in team
- Check database connection

## API Reference

All actions use Next.js Server Actions:

```typescript
// Create team
await createTeam(organizationId, name, description);

// Get teams
await getOrganizationTeams(organizationId);

// Get single team
await getTeamById(teamId);

// Update team
await updateTeam(teamId, name, description);

// Delete team
await deleteTeam(teamId);

// Add member
await addMemberToTeam(teamId, userId, role);

// Remove member
await removeMemberFromTeam(teamId, userId);

// Update member role
await updateTeamMemberRole(teamId, userId, role);
```

## Database Indexes

Optimized queries with indexes on:
- `team.organizationId`
- `teamMember.teamId`
- `teamMember.userId`

## Security

- All actions verify authentication
- Permission checks before modifications
- SQL injection protection via Drizzle ORM
- Cascade deletes for data integrity

---

**Status**: Production Ready ✅  
**Last Updated**: December 1, 2025  
**Version**: 1.0.0
