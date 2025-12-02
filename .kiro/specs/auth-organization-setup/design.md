# Design Document

## Overview

The Authentication & Organization Setup feature provides a secure, scalable foundation for WorkNest using Better Auth with organizational support, Drizzle ORM for type-safe database operations, and shadcn/ui for a polished user interface. The system implements session-based authentication with HTTP-only cookies, organizational data isolation, and a comprehensive setup wizard.

## Architecture

### Technology Stack
- **Authentication**: Better Auth with organization plugin
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Dodo Payments integration
- **UI Framework**: Next.js 14 with shadcn/ui components
- **Styling**: Tailwind CSS with WorkNest brand colors
- **Session Management**: HTTP-only, secure cookies with 24-hour expiration

### Core Components
```
worknest-app/
├── src/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── auth.ts           # Better Auth configuration
│   │   │   ├── client.ts         # Client-side auth utilities
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── db/
│   │   │   ├── schema.ts         # Drizzle schema definitions
│   │   │   ├── index.ts          # Database connection
│   │   │   └── migrations/       # Database migrations
│   │   ├── payments/
│   │   │   ├── dodo.ts           # Dodo Payments integration
│   │   │   ├── plans.ts          # Subscription plans configuration
│   │   │   └── webhooks.ts       # Payment webhooks
│   │   └── utils/
│   │       ├── validation.ts     # Input validation schemas
│   │       └── security.ts       # Security utilities
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── setup/
│   │   ├── (billing)/
│   │   │   ├── plans/
│   │   │   ├── checkout/
│   │   │   └── success/
│   │   ├── api/
│   │   │   ├── auth/[...all]/    # Better Auth API routes
│   │   │   ├── payments/         # Dodo Payments API routes
│   │   │   └── webhooks/         # Payment webhooks
│   │   └── dashboard/
│   └── components/
│       ├── ui/                   # shadcn/ui components
│       ├── auth/                 # Authentication components
│       ├── billing/              # Payment and subscription components
│       └── setup/                # Organization setup components
```

## Components and Interfaces

### Authentication Configuration (lib/auth/auth.ts)
```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization } from "better-auth/plugins"
import { db } from "@/lib/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 1, // One org per user initially
      sendInvitationEmail: true
    }),
    dodoPayments({
      apiKey: process.env.DODO_API_KEY!,
      webhookSecret: process.env.DODO_WEBHOOK_SECRET!
    })
  ],
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
  advanced: {
    crossSubDomainCookies: {
      enabled: false
    }
  }
})
```

### Database Schema (lib/db/schema.ts)
```typescript
import { pgTable, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core"

// Better Auth will auto-generate user, session, account tables
// Additional WorkNest-specific tables:

export const organizations = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logo: text("logo"),
  industry: text("industry"),
  size: text("size"), // "1-10", "11-50", "51-200", "200+"
  timezone: text("timezone").default("UTC"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
})

export const organizationSettings = pgTable("organization_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id").references(() => organizations.id),
  onboardingEnabled: boolean("onboarding_enabled").default(true),
  slackIntegrationEnabled: boolean("slack_integration_enabled").default(false),
  googleWorkspaceEnabled: boolean("google_workspace_enabled").default(false),
  setupCompleted: boolean("setup_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
})
```

### UI Components

#### Login Page Component
```typescript
// components/auth/login-form.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      })
    } catch (error) {
      // Handle error with toast notification
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to WorkNest</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

#### Organization Setup Wizard
```typescript
// components/setup/organization-wizard.tsx
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrganizationData {
  name: string
  industry: string
  size: string
  timezone: string
}

export function OrganizationWizard() {
  const [step, setStep] = useState(1)
  const [orgData, setOrgData] = useState<OrganizationData>({
    name: "",
    industry: "",
    size: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const handleComplete = async () => {
    // Submit organization setup data
    // Redirect to dashboard
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Set Up Your Organization</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Organization Name"
              value={orgData.name}
              onChange={(e) => setOrgData({...orgData, name: e.target.value})}
            />
            <Select onValueChange={(value) => setOrgData({...orgData, industry: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setStep(2)} className="w-full">
              Continue
            </Button>
          </div>
        )}
        {/* Additional setup steps */}
      </CardContent>
    </Card>
  )
}
```

## Data Models

### User Model (Extended by Better Auth)
- Standard Better Auth user fields (id, email, name, etc.)
- Organization membership through Better Auth organization plugin
- Role-based permissions within organizations

### Organization Model
- Basic organization information (name, slug, industry, size)
- Settings and configuration options
- Integration enablement flags
- Setup completion status

### Security Model
- Row Level Security (RLS) policies for data isolation
- Session-based authentication with secure cookies
- Input validation and sanitization
- Rate limiting on authentication endpoints

## Error Handling

### Authentication Errors
- Generic error messages to prevent user enumeration
- Structured error logging without exposing sensitive data
- Graceful fallbacks for failed authentication attempts
- Clear user feedback for validation errors

### Database Errors
- Transaction rollbacks for failed operations
- Proper error boundaries in React components
- Retry mechanisms for transient failures
- Monitoring and alerting for critical errors

### Integration Errors
- Fallback modes when external services are unavailable
- User-friendly error messages for integration failures
- Automatic retry with exponential backoff
- Circuit breaker patterns for external API calls

## Testing Strategy

### Unit Tests
- Authentication utility functions
- Input validation schemas
- Database query functions
- Component rendering and interactions

### Integration Tests
- Complete authentication flows (signup, login, logout)
- Organization setup wizard functionality
- Database operations with real database
- API endpoint testing with proper authentication

### Security Tests
- SQL injection prevention testing
- XSS vulnerability scanning
- Authentication bypass attempts
- Session management security
- CSRF protection validation

### End-to-End Tests
- Complete user registration and setup flow
- Organization creation and configuration
- Multi-user organization scenarios
- Cross-browser compatibility testing

## Security Considerations

### Data Protection
- All passwords hashed using Better Auth's secure defaults
- Sensitive data encrypted at rest
- HTTPS enforcement for all communications
- Secure cookie configuration (HttpOnly, Secure, SameSite)

### Access Control
- Organization-based data isolation using RLS
- Role-based permissions within organizations
- API endpoint protection with proper authentication
- Input validation and sanitization on all user inputs

### Session Security
- 24-hour session expiration with automatic renewal
- Secure session storage using HTTP-only cookies
- Session invalidation on logout
- Protection against session fixation attacks

### Compliance
- GDPR-compliant data handling
- Audit logging for security events
- Data retention policies
- User data export and deletion capabilities