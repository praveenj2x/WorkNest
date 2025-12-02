"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
  Building2,
  Briefcase,
  Calendar,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function AppSidebar({ user, organization }: AppSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Tasks",
      url: `/dashboard/${organization.id}/tasks`,
      icon: CheckSquare,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: Users,
    },
    {
      title: "Members",
      url: "/dashboard/members",
      icon: UserPlus,
    },
    {
      title: "Recruitment",
      url: "/dashboard/recruitment",
      icon: Briefcase,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{organization.name}</span>
            <span className="text-xs text-muted-foreground">@{organization.slug}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-accent rounded-lg p-2 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <form action="/api/auth/sign-out" method="POST">
                <button type="submit" className="flex items-center w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
