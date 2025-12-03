"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink } from "lucide-react";

interface PendingInvitation {
    id: string;
    organizationId: string;
    email: string;
    role: string | null;
    expiresAt: Date;
    organization: {
        id: string;
        name: string;
        slug: string;
    };
}

interface PendingInvitationsProps {
    invitations: PendingInvitation[];
}

export function PendingInvitationsCard({ invitations }: PendingInvitationsProps) {
    const router = useRouter();
    const [dismissed, setDismissed] = useState<string[]>([]);

    // Load dismissed invitations from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("dismissedInvitations");
        if (stored) {
            setDismissed(JSON.parse(stored));
        }
    }, []);

    const handleDismiss = (invitationId: string) => {
        const newDismissed = [...dismissed, invitationId];
        setDismissed(newDismissed);
        localStorage.setItem("dismissedInvitations", JSON.stringify(newDismissed));
    };

    const handleAccept = (email: string, orgId: string) => {
        router.push(`/auth/accept-invite?email=${encodeURIComponent(email)}&org=${orgId}`);
    };

    // Filter out dismissed invitations
    const visibleInvitations = invitations.filter(
        inv => !dismissed.includes(inv.id)
    );

    if (visibleInvitations.length === 0) {
        return null;
    }

    return (
        <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Pending Invitations</CardTitle>
                </div>
                <CardDescription>
                    You have {visibleInvitations.length} pending invitation{visibleInvitations.length !== 1 ? 's' : ''}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {visibleInvitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border"
                    >
                        <div className="flex-1">
                            <p className="font-medium">{invitation.organization.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Role: {invitation.role || "Member"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleAccept(invitation.email, invitation.organizationId)}
                            >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDismiss(invitation.id)}
                            >
                                Dismiss
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
