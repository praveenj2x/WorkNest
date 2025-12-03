import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserOrganization, getUserOrganizations } from "@/actions/organization";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { OrganizationSwitcher } from "@/components/organization-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const organization = await getUserOrganization();
  const organizations = await getUserOrganizations();

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
          <div className="flex items-center justify-between mb-4">
            <SidebarTrigger />
            {organizations.length > 1 && (
              <div className="w-64">
                <OrganizationSwitcher
                  organizations={organizations}
                  currentOrganization={{
                    id: organization.id,
                    name: organization.name,
                    slug: organization.slug,
                    role: organizations.find(o => o.id === organization.id)?.role || "member",
                  }}
                />
              </div>
            )}
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
