import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, twoFactor } from "better-auth/plugins";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL for production HR data
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  
  // Email/password auth with verification for HR security
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12, // Strong passwords for HR data access
    maxPasswordLength: 128,
    autoSignIn: false, // Require email verification first
  },
  
  // Google Workspace integration for HR teams
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  // Security plugins for HR platform
  plugins: [
    admin(), // Role-based access control for HR admins
    twoFactor(), // Enhanced security for sensitive employee data
  ],
  
  // Session configuration for HR security
  session: {
    expiresIn: 60 * 60 * 8, // 8 hours for HR work sessions
    updateAge: 60 * 60, // Update session every hour
  },
  
  // Trusted origins for WorkNest deployment
  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    "http://localhost:3000", // Development
  ],
});