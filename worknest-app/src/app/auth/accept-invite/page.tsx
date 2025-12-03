"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import { acceptInvitation } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const email = searchParams.get("email");
  const orgId = searchParams.get("org");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState("Processing invitation...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !orgId) {
      setStatus("error");
      setMessage("Invalid invitation link");
      setError("Missing required parameters");
      return;
    }

    // Store invitation info in sessionStorage for after sign-in
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pendingInvitation", JSON.stringify({ email, orgId }));
    }

    if (isPending) {
      setStatus("loading");
      setMessage("Checking your session...");
      return;
    }

    if (!session) {
      setStatus("pending");
      setMessage("Please sign in to accept this invitation");
      return;
    }

    // User is signed in, attempt to accept the invitation
    handleAcceptInvitation();
  }, [email, orgId, session, isPending]);

  const handleAcceptInvitation = async () => {
    if (!email || !orgId) return;

    setStatus("loading");
    setMessage("Accepting invitation...");

    try {
      const result = await acceptInvitation(email, orgId);

      if (result.error) {
        setStatus("error");
        setMessage("Failed to accept invitation");
        setError(result.error);
      } else {
        setStatus("success");
        setMessage("Successfully joined the organization!");

        // Clear the stored invitation
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pendingInvitation");
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-600" />;
      case "pending":
        return <AlertCircle className="h-12 w-12 text-yellow-600" />;
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-center">Accept Invitation</CardTitle>
        <CardDescription className="text-center">
          {email && `Invitation for ${email}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          {getIcon()}

          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{message}</p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </p>
            )}
          </div>

          {status === "pending" && (
            <div className="w-full space-y-3 pt-4">
              <Button
                onClick={() => {
                  router.push(`/auth?redirect=/auth/accept-invite?email=${encodeURIComponent(email || "")}&org=${orgId}`);
                }}
                className="w-full"
              >
                Sign In to Accept
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You'll be redirected back here after signing in
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="w-full space-y-3 pt-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "success" && (
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense fallback={
        <Card className="max-w-md w-full">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      }>
        <InviteContent />
      </Suspense>
    </div>
  );
}
