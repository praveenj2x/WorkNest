"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import Link from "next/link";

interface CandidateCardProps {
  candidate: any;
}

const statusColors: Record<string, string> = {
  invited: "bg-blue-100 text-blue-800",
  submitted: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {candidate.name || candidate.email}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{candidate.position}</p>
          </div>
          <Badge className={statusColors[candidate.status] || ""}>
            {candidate.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{candidate.email}</span>
        </div>

        {candidate.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{candidate.phone}</span>
          </div>
        )}

        {candidate.dateOfBirth && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(candidate.dateOfBirth).toLocaleDateString()}</span>
          </div>
        )}

        {candidate.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{candidate.address}</span>
          </div>
        )}

        {candidate.documents && candidate.documents.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{candidate.documents.length} document(s)</span>
          </div>
        )}

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/dashboard/recruitment/${candidate.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
