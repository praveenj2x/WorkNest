import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const organization = await getUserOrganization();

  if (!organization) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              View and manage your organization information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input value={organization.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Organization Slug</Label>
              <Input value={organization.slug} disabled />
            </div>
            <div className="space-y-2">
              <Label>Created At</Label>
              <Input
                value={new Date(organization.createdAt).toLocaleDateString()}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={session.user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={session.user.email} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              Delete Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
