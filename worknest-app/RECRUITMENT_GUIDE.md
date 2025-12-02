# Recruitment System Guide

## Overview

Your HR management system now includes a complete recruitment and candidate onboarding flow. Admins can invite candidates, who then complete their application through a dedicated portal, and HR can review and manage all applications.

## Features Implemented

### 1. Recruitment Dashboard (`/dashboard/recruitment`)

**For Admins/Owners:**
- View all candidates grouped by status
- Statistics cards showing counts for each status
- Invite new candidates via email
- Quick access to candidate details

**Candidate Statuses:**
- **Invited**: Candidate has been sent an invitation email
- **Submitted**: Candidate completed their application
- **Reviewing**: Application is under review
- **Approved**: Candidate has been approved
- **Rejected**: Application was rejected

### 2. Candidate Invitation System

**How it works:**
1. Admin clicks "Invite Candidate"
2. Enters candidate email and position
3. System generates unique token (14-day expiration)
4. Email sent with application link
5. Candidate appears in "Invited" status

**Email includes:**
- Position details
- Organization name
- Secure application link
- Expiration notice (14 days)

### 3. Candidate Application Portal (`/recruitment/apply/[token]`)

**3-Step Process:**

#### Step 1: Personal Information
Candidate provides:
- Full Name *
- Phone Number *
- Date of Birth *
- Address *

#### Step 2: Document Upload
Required/Optional documents:
- **Resume/CV** (Required) - PDF, DOC, DOCX
- **NOC** (No Objection Certificate) - Optional
- **Other Documents** - Certificates, etc. - Optional

#### Step 3: Confirmation
- Success message
- Application submitted notification
- Status changes to "Submitted"

**Security Features:**
- Token-based access (unique per candidate)
- 14-day expiration
- One-time submission
- Cannot resubmit after completion

### 4. Candidate Review System

**Admin Review Page** (`/dashboard/recruitment/[candidateId]`)

**Information Displayed:**
- Personal details (name, email, phone, DOB, address)
- Application timeline (invited, submitted, reviewed dates)
- Position applied for
- Inviter information
- Reviewer information (if reviewed)
- All uploaded documents with download links
- Review notes

**Review Actions:**
- **Mark as Reviewing**: Move to review queue
- **Approve**: Accept the candidate
- **Reject**: Decline the application
- **Add Notes**: Internal notes about the candidate

## Database Schema

### Candidate Table
```typescript
{
  id: string (UUID)
  organizationId: string (FK)
  email: string
  name: string
  phone: string
  dateOfBirth: timestamp
  address: string
  position: string
  status: string (invited|submitted|reviewing|approved|rejected)
  invitedBy: string (FK to user)
  invitedAt: timestamp
  submittedAt: timestamp
  reviewedAt: timestamp
  reviewedBy: string (FK to user)
  notes: string
  token: string (unique)
  expiresAt: timestamp
}
```

### Candidate Document Table
```typescript
{
  id: string (UUID)
  candidateId: string (FK)
  type: string (resume|noc|certificate|other)
  fileName: string
  fileUrl: string
  fileSize: string
  uploadedAt: timestamp
}
```

## Server Actions

### `inviteCandidate(organizationId, email, position)`
- Creates candidate record
- Generates unique token
- Sends invitation email
- Returns candidate data

### `getCandidateByToken(token)`
- Validates token
- Checks expiration
- Returns candidate with documents
- Used by application portal

### `submitCandidateInfo(token, data)`
- Updates candidate personal info
- Changes status to "submitted"
- Records submission timestamp

### `uploadCandidateDocument(candidateId, type, fileName, fileUrl, fileSize)`
- Stores document metadata
- Links to candidate
- Returns success/error

### `getOrganizationCandidates(organizationId)`
- Fetches all candidates for organization
- Includes relations (inviter, reviewer, documents)
- Ordered by invitation date (newest first)

### `updateCandidateStatus(candidateId, status, notes)`
- Updates candidate status
- Records reviewer and review time
- Saves optional notes

## User Flow

### Admin Flow

1. **Navigate to Recruitment**
   - Click "Recruitment" in sidebar
   - View dashboard with statistics

2. **Invite Candidate**
   - Click "Invite Candidate"
   - Enter email and position
   - Submit invitation

3. **Monitor Applications**
   - View candidates by status
   - Check new submissions
   - Review applications

4. **Review Candidate**
   - Click "View Details" on candidate card
   - Review personal information
   - Download and review documents
   - Add notes
   - Approve or reject

### Candidate Flow

1. **Receive Email**
   - Get invitation email
   - Click application link

2. **Complete Personal Info**
   - Fill out required fields
   - Submit to continue

3. **Upload Documents**
   - Upload resume (required)
   - Upload NOC (optional)
   - Upload other documents (optional)
   - Submit application

4. **Confirmation**
   - See success message
   - Wait for HR review

## Email Templates

### Invitation Email
```
Subject: Job Application Invitation - [Position]

You've been invited to apply!

[Inviter Name] has invited you to apply for the position of [Position].

Please complete your application by clicking the link below:

[Complete Application Button]

This invitation will expire in 14 days.
```

## File Upload (Implementation Note)

The current implementation includes a placeholder for file uploads. To complete this:

### Option 1: Cloud Storage (Recommended)

**AWS S3:**
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const uploadToS3 = async (file: File) => {
  const s3 = new S3Client({ region: "us-east-1" });
  const command = new PutObjectCommand({
    Bucket: "your-bucket",
    Key: `candidates/${Date.now()}-${file.name}`,
    Body: file,
  });
  await s3.send(command);
  return `https://your-bucket.s3.amazonaws.com/...`;
};
```

**Cloudinary:**
```typescript
import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (file: File) => {
  const result = await cloudinary.uploader.upload(file);
  return result.secure_url;
};
```

### Option 2: Local Storage (Development Only)
```typescript
import { writeFile } from "fs/promises";
import path from "path";

const uploadLocal = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(process.cwd(), "public/uploads", file.name);
  await writeFile(filePath, buffer);
  return `/uploads/${file.name}`;
};
```

## Security Considerations

### Token Security
- Unique UUID for each candidate
- 14-day expiration
- One-time use (status check)
- Cannot access after submission

### Access Control
- Only Owner/Admin can invite candidates
- Only Owner/Admin can review applications
- Candidates can only access their own application
- Token required for candidate portal

### Data Validation
- Email validation
- Required field checks
- File type restrictions (PDF, DOC, DOCX)
- Date validation

## Customization

### Add More Document Types

Edit `src/actions/recruitment.ts`:
```typescript
// Add new document type
type: "passport" | "resume" | "noc" | "certificate" | "other"
```

Edit application page to add new upload field.

### Add More Personal Fields

Update schema:
```typescript
export const candidate = pgTable("candidate", {
  // ... existing fields
  linkedin: text("linkedin"),
  portfolio: text("portfolio"),
  yearsOfExperience: text("years_of_experience"),
});
```

Update application form to collect new fields.

### Custom Email Templates

Edit `sendCandidateInvitation()` in `src/actions/recruitment.ts`:
```typescript
html: `
  <div style="font-family: Arial, sans-serif;">
    <!-- Your custom HTML template -->
  </div>
`
```

### Add Interview Scheduling

Create new status: "interview_scheduled"
Add interview date field to candidate table
Create interview scheduling component

## Migration

Run the migration to create tables:

```bash
npx drizzle-kit push
```

This creates:
- `candidate` table
- `candidate_document` table
- All necessary indexes and foreign keys

## Testing Checklist

- [ ] Admin can invite candidate
- [ ] Candidate receives email
- [ ] Candidate can access application via token
- [ ] Candidate can submit personal info
- [ ] Candidate can upload documents
- [ ] Application shows as "submitted"
- [ ] Admin can view candidate details
- [ ] Admin can download documents
- [ ] Admin can approve/reject
- [ ] Status updates correctly
- [ ] Expired tokens are rejected
- [ ] Already submitted applications can't resubmit

## Troubleshooting

### Candidate can't access application
- Check token is correct
- Verify invitation hasn't expired (14 days)
- Check candidate status (should be "invited")

### Documents not uploading
- Implement file upload to cloud storage
- Check file size limits
- Verify file type restrictions

### Email not sending
- Verify RESEND_API_KEY in .env
- Check Resend dashboard for logs
- Verify EMAIL_FROM domain

### Can't see candidates
- Check user is Owner or Admin
- Verify organization ID matches
- Check database for candidate records

## Future Enhancements

### Phase 1 (Recommended)
- [ ] Implement actual file upload to S3/Cloudinary
- [ ] Add candidate search and filtering
- [ ] Export candidate data to CSV
- [ ] Bulk status updates
- [ ] Email notifications on status changes

### Phase 2 (Advanced)
- [ ] Interview scheduling system
- [ ] Candidate scoring/rating
- [ ] Application templates
- [ ] Automated screening questions
- [ ] Integration with ATS systems
- [ ] Video interview integration
- [ ] Background check integration
- [ ] Offer letter generation

## API Endpoints

All actions are server-side using Next.js Server Actions:

- `POST /actions/recruitment/inviteCandidate`
- `GET /actions/recruitment/getCandidateByToken`
- `POST /actions/recruitment/submitCandidateInfo`
- `POST /actions/recruitment/uploadCandidateDocument`
- `GET /actions/recruitment/getOrganizationCandidates`
- `POST /actions/recruitment/updateCandidateStatus`

## Performance

- Database queries use indexes on:
  - `organizationId`
  - `email`
  - `token`
  - `status`
- Relations preloaded for efficiency
- Pagination ready (not yet implemented)

---

**Status**: Production Ready (except file upload implementation)  
**Last Updated**: December 1, 2025  
**Version**: 1.0.0
