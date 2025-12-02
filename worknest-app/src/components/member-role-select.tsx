"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMemberRole } from "@/actions/teams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const roles = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

interface MemberRoleSelectProps {
  organizationId: string;
  memberId: string;
  currentRole: string;
}

export function MemberRoleSelect({
  organizationId,
  memberId,
  currentRole,
}: MemberRoleSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;

    setLoading(true);
    const result = await updateMemberRole(organizationId, memberId, newRole);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          {currentRole}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            className={currentRole === role.value ? "bg-accent" : ""}
          >
            {role.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
