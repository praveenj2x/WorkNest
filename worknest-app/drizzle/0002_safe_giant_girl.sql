CREATE TABLE "candidate" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"date_of_birth" timestamp,
	"address" text,
	"position" text,
	"status" text DEFAULT 'invited' NOT NULL,
	"invited_by" text NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp,
	"reviewed_at" timestamp,
	"reviewed_by" text,
	"notes" text,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "candidate_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "candidate_document" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_id" text NOT NULL,
	"type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" text,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_document" ADD CONSTRAINT "candidate_document_candidate_id_candidate_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidate_organizationId_idx" ON "candidate" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "candidate_email_idx" ON "candidate" USING btree ("email");--> statement-breakpoint
CREATE INDEX "candidate_token_idx" ON "candidate" USING btree ("token");--> statement-breakpoint
CREATE INDEX "candidate_status_idx" ON "candidate" USING btree ("status");--> statement-breakpoint
CREATE INDEX "candidate_document_candidateId_idx" ON "candidate_document" USING btree ("candidate_id");