# Invitation Acceptance Implementation

## Overview
This implementation allows invited users to accept invitations and join organizations in your WorkNest application.

## How It Works

### 1. **Invitation Flow**

When an admin invites a user:
1. An invitation record is created in the database with status "pending"
2. An email is sent to the invited user with a link like:
   ```
   https://yourapp.com/auth/accept-invite?email=user@example.com&org=org-id
   ```

### 2. **Acceptance Process**

When a user clicks the invitation link:

1. **Landing on Accept Invite Page** (`/auth/accept-invite`)
   - The page extracts `email` and `org` parameters from the URL
   - Stores invitation info in sessionStorage for persistence
   - Checks if user is already signed in

2. **If User is NOT Signed In**
   - Shows a "Sign In to Accept" button
   - Redirects to `/auth` with a redirect parameter back to the invite page
   - After signing in, user is redirected back to accept-invite page

3. **If User IS Signed In**
   - Automatically calls the `acceptInvitation` server action
   - Validates:
     - Email matches the signed-in user
     - Invitation exists and is pending
     - Invitation hasn't expired
     - User isn't already a member
   - Creates a member record with the role from the invitation
   - Updates invitation status to "accepted"
   - Redirects to dashboard after 2 seconds

### 3. **Server Action: `acceptInvitation`**

Located in: `src/actions/organization.ts`

```typescript
acceptInvitation(email: string, organizationId: string)
```

**Validations:**
- User must be signed in
- Email must match the signed-in user's email
- Invitation must exist for that email and organization
- Invitation must not be expired
- Invitation must have status "pending"
- User must not already be a member of the organization

**Actions:**
- Creates a new member record
- Updates invitation status to "accepted"
- Returns success or error message

## Files Modified

### 1. `src/actions/organization.ts`
- Added `acceptInvitation` function

### 2. `src/app/auth/accept-invite/page.tsx`
- Complete rewrite with:
  - Session checking using `useSession` hook
  - Automatic invitation acceptance for signed-in users
  - Redirect handling for non-signed-in users
  - Visual feedback with loading, success, and error states
  - Icons for different states (Loader2, CheckCircle, XCircle, AlertCircle)

### 3. `src/app/auth/page.tsx`
- Added redirect parameter support
- Uses `useSearchParams` to get redirect URL
- Passes redirect URL to social sign-in callbacks

## Database Schema

The implementation uses the existing `invitation` table:

```typescript
invitation {
  id: string (primary key)
  organizationId: string (foreign key)
  email: string
  role: string (e.g., "member", "admin")
  status: string (default: "pending")
  expiresAt: timestamp
  createdAt: timestamp
  inviterId: string (foreign key to user)
}
```

And creates records in the `member` table:

```typescript
member {
  id: string (primary key)
  organizationId: string (foreign key)
  userId: string (foreign key)
  role: string (from invitation)
  createdAt: timestamp
}
```

## User Experience

1. **Invited User Receives Email**
   - Email contains invitation link with email and org parameters

2. **User Clicks Link**
   - If not signed in: Sees invitation details and "Sign In to Accept" button
   - If signed in: Sees loading spinner, then success message

3. **After Acceptance**
   - User is automatically redirected to dashboard
   - User can now access organization resources
   - User appears in the organization's member list

## Error Handling

The implementation handles various error cases:

- **Invalid invitation link**: Missing email or org parameters
- **Wrong email**: Signed-in user's email doesn't match invitation
- **Invitation not found**: No matching invitation in database
- **Expired invitation**: Invitation past expiration date
- **Already used**: Invitation status is not "pending"
- **Already a member**: User is already part of the organization

## Security Considerations

1. **Email Verification**: Only the user with the invited email can accept
2. **Session Validation**: User must be authenticated
3. **Expiration**: Invitations expire after 7 days
4. **One-time Use**: Invitation status changes to "accepted" after use
5. **Organization Validation**: Invitation must match the organization ID

## Testing the Feature

1. **Create an organization** (if you don't have one)
2. **Invite a user** from the members page
3. **Check email** for invitation link
4. **Click the link** and sign in (if needed)
5. **Verify** the user appears in the organization's member list

## Future Enhancements

Potential improvements:
- Add invitation revocation functionality
- Support for team-specific invitations
- Bulk invitation acceptance
- Custom invitation messages
- Invitation analytics (sent, opened, accepted rates)
