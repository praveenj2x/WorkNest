# Quick Start Guide - HR Management Dashboard

## What's Been Built

✅ **Complete Dashboard** with sidebar navigation  
✅ **Team Management** - Create and view teams  
✅ **Member Management** - Invite and manage roles  
✅ **Role-Based Access** - Owner, Admin, Member permissions  
✅ **Modern UI** - shadcn/ui components throughout  

## Getting Started

### 1. Install Dependencies (if needed)

```bash
npm install
```

### 2. Environment Variables

Make sure your `.env` has:

```env
# Already configured
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# For email invitations
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=onboarding@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000`

## User Journey

### First Time User

1. Go to `/auth` → Sign in with Google/GitHub
2. Redirected to `/onboarding`
3. Create organization (name + slug)
4. Optionally invite team members
5. Redirected to `/dashboard`

### Returning User

1. Sign in → Automatically go to `/dashboard`
2. See overview with stats
3. Navigate using sidebar

## Dashboard Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | Overview with stats | All |
| `/dashboard/teams` | Team management | All (create: Owner/Admin) |
| `/dashboard/members` | Member management | All (invite/roles: Owner/Admin) |
| `/dashboard/settings` | Organization settings | All |

## Key Features

### Create Teams
1. Go to `/dashboard/teams`
2. Click "Create Team"
3. Enter name and description
4. Team created instantly

### Invite Members
1. Go to `/dashboard/members`
2. Click "Invite Members"
3. Add email addresses
4. Emails sent via Resend

### Manage Roles
1. Go to `/dashboard/members`
2. Click role dropdown (Owner/Admin only)
3. Select new role
4. Updates immediately

## Roles & Permissions

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| View dashboard | ✅ | ✅ | ✅ |
| Create teams | ✅ | ✅ | ❌ |
| Invite members | ✅ | ✅ | ❌ |
| Change roles | ✅ | ✅ | ❌ |
| View all data | ✅ | ✅ | ✅ |

## Components Overview

### Sidebar (`app-sidebar.tsx`)
- Organization branding
- Navigation menu
- User profile with sign out

### Dialogs
- `create-team-dialog.tsx` - Team creation
- `invite-member-dialog.tsx` - Member invitations

### Role Management
- `member-role-select.tsx` - Dropdown for role changes

## Server Actions

All in `src/actions/`:

**organization.ts**
- `createOrganization()` - Create org
- `inviteMembers()` - Send invites
- `getUserOrganization()` - Get user's org

**teams.ts**
- `createTeam()` - Create team
- `getOrganizationTeams()` - List teams
- `getOrganizationMembers()` - List members
- `updateMemberRole()` - Change role
- `addMemberToTeam()` - Add to team
- `removeMemberFromTeam()` - Remove from team

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Better Auth with organization plugin
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Email**: Resend
- **Deployment**: Ready for Vercel

## Common Tasks

### Add a new sidebar menu item

Edit `src/components/app-sidebar.tsx`:

```typescript
const menuItems = [
  // ... existing items
  {
    title: "New Page",
    url: "/dashboard/new-page",
    icon: YourIcon,
  },
];
```

### Create a new dashboard page

1. Create file: `src/app/(root)/dashboard/your-page/page.tsx`
2. Add to sidebar menu
3. Implement page component

### Add a new role

1. Update `src/components/member-role-select.tsx` roles array
2. Update database schema if needed
3. Update permission checks in server actions

## Troubleshooting

**Issue**: Can't see dashboard after login  
**Fix**: Check middleware.ts is running, verify organization exists

**Issue**: Teams not showing  
**Fix**: Better Auth team API needs proper setup, check console logs

**Issue**: Can't invite members  
**Fix**: Verify RESEND_API_KEY in .env

**Issue**: Sidebar not appearing  
**Fix**: Check dashboard layout.tsx is wrapping pages

## Next Steps

1. **Get Resend API Key**: [resend.com](https://resend.com)
2. **Test the flow**: Sign in → Create org → Invite members
3. **Customize**: Update branding, colors, add features

## File Structure

```
src/
├── app/(root)/dashboard/
│   ├── layout.tsx              ← Sidebar wrapper
│   ├── page.tsx                ← Dashboard home
│   ├── teams/page.tsx          ← Teams list
│   ├── members/page.tsx        ← Members list
│   └── settings/page.tsx       ← Settings
├── components/
│   ├── app-sidebar.tsx         ← Main sidebar
│   ├── create-team-dialog.tsx
│   ├── invite-member-dialog.tsx
│   └── member-role-select.tsx
└── actions/
    ├── organization.ts
    └── teams.ts
```

## Resources

- [Better Auth Docs](https://better-auth.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Resend Docs](https://resend.com/docs)

---

**Ready to go!** Start with `npm run dev` and sign in to see your dashboard.
