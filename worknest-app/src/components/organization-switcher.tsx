"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { setActiveOrganization } from "@/actions/organization";
import { useRouter } from "next/navigation";

interface Organization {
    id: string;
    name: string;
    slug: string;
    role: string;
}

interface OrganizationSwitcherProps {
    organizations: Organization[];
    currentOrganization: Organization;
}

export function OrganizationSwitcher({
    organizations,
    currentOrganization,
}: OrganizationSwitcherProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSelect = async (orgId: string) => {
        if (orgId === currentOrganization.id) {
            setOpen(false);
            return;
        }

        setLoading(true);
        const result = await setActiveOrganization(orgId);

        if (result.success) {
            router.refresh();
            setOpen(false);
        } else {
            console.error("Failed to switch organization:", result.error);
        }
        setLoading(false);
    };

    if (organizations.length <= 1) {
        return (
            <div className="flex items-center gap-2 px-2 py-1.5">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentOrganization.name}</span>
            </div>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={loading}
                >
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{currentOrganization.name}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search organizations..." />
                    <CommandList>
                        <CommandEmpty>No organization found.</CommandEmpty>
                        <CommandGroup heading="Your Organizations">
                            {organizations.map((org) => (
                                <CommandItem
                                    key={org.id}
                                    value={org.id}
                                    onSelect={() => handleSelect(org.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentOrganization.id === org.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{org.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {org.role}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
