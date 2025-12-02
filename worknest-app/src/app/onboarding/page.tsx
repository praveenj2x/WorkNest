"use client";

import { useState } from "react";
import { createOrganization, inviteMembers } from "@/actions/organization";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [organizationId, setOrganizationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emails, setEmails] = useState([""]);

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createOrganization(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.organizationId) {
      setOrganizationId(result.organizationId);
      setStep(2);
      setLoading(false);
    }
  };

  const handleInviteMembers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validEmails = emails.filter(email => email.trim() !== "");
    
    if (validEmails.length > 0) {
      const result = await inviteMembers(organizationId, validEmails);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    }

    // Redirect to dashboard
    router.push("/dashboard");
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 1 ? "Create Your Organization" : "Invite Team Members"}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1 
              ? "Let's get started by setting up your organization" 
              : "Invite your team to collaborate (optional)"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                pattern="[a-z0-9-]+"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="acme-inc"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleInviteMembers} className="space-y-4">
            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="colleague@example.com"
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addEmailField}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add another email
            </button>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Sending..." : "Send Invites"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}