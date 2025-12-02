"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCandidateByToken, submitCandidateInfo } from "@/actions/recruitment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Upload, CheckCircle } from "lucide-react";

export default function CandidateApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<{
    resume?: File;
    noc?: File;
    other?: File;
  }>({});

  useEffect(() => {
    loadCandidate();
  }, [token]);

  const loadCandidate = async () => {
    const result = await getCandidateByToken(token);
    if (result.error) {
      setError(result.error);
    } else {
      setCandidate(result.candidate);
      if (result.candidate?.status !== "invited") {
        setStep(3); // Already submitted
      }
    }
    setLoading(false);
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      address: formData.get("address") as string,
    };

    const result = await submitCandidateInfo(token, data);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      setStep(2);
      setSubmitting(false);
    }
  };

  const handleFileChange = (type: string, file: File | null) => {
    if (file) {
      setDocuments((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleDocumentUpload = async () => {
    setSubmitting(true);
    setError("");

    // In a real app, you'd upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll simulate the upload
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would:
      // 1. Upload files to storage
      // 2. Get URLs
      // 3. Save to database using uploadCandidateDocument action

      setStep(3);
      setSubmitting(false);
    } catch (err) {
      setError("Failed to upload documents");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 mb-4">
              <Briefcase className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Briefcase className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold">Job Application</h1>
          <p className="text-muted-foreground mt-2">
            {candidate?.organization?.name} - {candidate?.position}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="123 Main St, City, Country"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Saving..." : "Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Please upload the required documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="resume">Resume / CV *</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    handleFileChange("resume", e.target.files?.[0] || null)
                  }
                  required
                />
                {documents.resume && (
                  <p className="text-sm text-green-600">
                    ✓ {documents.resume.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="noc">No Objection Certificate (NOC)</Label>
                <Input
                  id="noc"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    handleFileChange("noc", e.target.files?.[0] || null)
                  }
                />
                {documents.noc && (
                  <p className="text-sm text-green-600">✓ {documents.noc.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="other">Other Documents (Certificates, etc.)</Label>
                <Input
                  id="other"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    handleFileChange("other", e.target.files?.[0] || null)
                  }
                />
                {documents.other && (
                  <p className="text-sm text-green-600">
                    ✓ {documents.other.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleDocumentUpload}
                  disabled={!documents.resume || submitting}
                  className="flex-1"
                >
                  {submitting ? "Uploading..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for completing your application. Our HR team will review
                your information and get back to you soon.
              </p>
              <p className="text-sm text-muted-foreground">
                You can close this page now.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
