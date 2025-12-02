"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users as UsersIcon } from "lucide-react";
import Link from "next/link";

interface CalendarViewProps {
  events: any[];
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  violet: "bg-violet-100 text-violet-800 border-violet-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  rose: "bg-rose-100 text-rose-800 border-rose-200",
};

export function CalendarView({ events }: CalendarViewProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedEvents.map((event) => (
        <Link
          key={event.id}
          href={`/dashboard/calendar/${event.id}`}
          className="block"
        >
          <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <Badge
                    className={colorClasses[event.color] || colorClasses.blue}
                  >
                    {event.eventType}
                  </Badge>
                  {event.team && (
                    <Badge variant="outline" className="text-xs">
                      {event.team.name}
                    </Badge>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.startTime), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.isAllDay
                      ? "All Day"
                      : `${format(new Date(event.startTime), "h:mm a")} - ${format(new Date(event.endTime), "h:mm a")}`}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" />
                      {event.attendees.length} attendees
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
