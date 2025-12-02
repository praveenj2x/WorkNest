import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization } from "@/actions/organization";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          ...(session.user.image && { image: session.user.image }),
        }}
        organization={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        }}
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <SidebarTrigger className="mb-4" />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
