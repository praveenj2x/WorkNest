import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { member } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Check if user has an organization
    const userMembership = await db.query.member.findFirst({
        where: eq(member.userId, session.user.id)
    });

    // If accessing dashboard but no org, redirect to onboarding
    if (request.nextUrl.pathname.startsWith("/dashboard") && !userMembership) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // If accessing onboarding but has org, redirect to dashboard
    if (request.nextUrl.pathname.startsWith("/onboarding") && userMembership) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/onboarding"], 
};