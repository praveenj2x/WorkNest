CREATE TABLE "calendar_event" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"team_id" text,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"location" text,
	"color" text DEFAULT 'blue' NOT NULL,
	"is_all_day" boolean DEFAULT false NOT NULL,
	"event_type" text DEFAULT 'meeting' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendee" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_event_id_calendar_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."calendar_event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calendar_event_organizationId_idx" ON "calendar_event" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "calendar_event_teamId_idx" ON "calendar_event" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "calendar_event_startTime_idx" ON "calendar_event" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "event_attendee_eventId_idx" ON "event_attendee" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_attendee_userId_idx" ON "event_attendee" USING btree ("user_id");