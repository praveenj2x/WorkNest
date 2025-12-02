# Organization Onboarding Setup

## What's Been Implemented

Your HR management software now has a complete organization onboarding flow:

1. **Authentication Check**: After Google/GitHub login, users are automatically checked for organization membership
2. **Smart Routing**: 
   - Users WITH an organization → Dashboard
   - Users WITHOUT an organization → Onboarding
3. **Organization Creation**: Two-step onboarding process
4. **Member Invitations**: Email invitations via Resend

## Setup Steps

### 1. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Create an API key
3. Add it to your `.env` file:

```env
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=onboarding@yourdomain.com  # Use your verified domain
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Run Database Migration

The schema already includes organization, member, and invitation tables. If you haven't run migrations yet:

```bash
npm run db:push
# or
npx drizzle-kit push
```

### 3. Test the Flow

1. Start your dev server: `npm run dev`
2. Sign in with Google or GitHub at `/auth`
3. You'll be redirected to `/onboarding` (first time users)
4. Create your organization
5. Invite team members (optional)
6. Get redirected to `/dashboard`

## How It Works

### Middleware (`middleware.ts`)
- Checks if user is authenticated
- Queries database for user's organization membership
- Redirects to appropriate page:
  - No auth → `/auth/sign-in`
  - No org → `/onboarding`
  - Has org → `/dashboard`

### Server Actions (`src/actions/organization.ts`)
- `createOrganization()`: Creates org and adds user as owner
- `inviteMembers()`: Sends email invitations via Resend
- `getUserOrganization()`: Gets user's current organization

### Onboarding Flow (`src/app/onboarding/page.tsx`)
- **Step 1**: Create organization (name + slug)
- **Step 2**: Invite team members (optional, can skip)
- Clean, simple UI with error handling

### Dashboard (`src/app/(root)/dashboard/page.tsx`)
- Shows organization details
- Displays user info
- Protected by middleware

## Email Invitation Format

Invitations include:
- Inviter's name
- Organization name
- Accept invitation link
- 7-day expiration

## Next Steps (Optional)

You might want to add:
- Accept invitation page at `/auth/accept-invite`
- Organization settings page
- Member management UI
- Role-based permissions
- Organization switching (if users can be in multiple orgs)

## Troubleshooting

**Redirect loop?**
- Check that your database has the organization and member tables
- Verify middleware matcher paths

**Emails not sending?**
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for logs
- For production, verify your domain in Resend

**Slug already exists error?**
- Organization slugs must be unique
- Try a different slug
