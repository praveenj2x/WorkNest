"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function InviteContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const orgId = searchParams.get("org");
  const [message, setMessage] = useState("Processing invitation...");

  useEffect(() => {
    // TODO: Implement invitation acceptance logic
    // This is a placeholder for future implementation
    setMessage("Invitation acceptance coming soon! Please sign in to continue.");
  }, [email, orgId]);

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Accept Invitation
      </h1>
      <p className="text-gray-600">{message}</p>
      
      {email && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Invitation for: <strong>{email}</strong>
          </p>
        </div>
      )}

      <div className="mt-8">
        <a
          href="/auth"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 font-medium"
        >
          Go to Sign In
        </a>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <InviteContent />
      </Suspense>
    </div>
  );
}
