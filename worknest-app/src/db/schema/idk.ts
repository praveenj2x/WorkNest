import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = pgTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

// Recruitment Tables
export const candidate = pgTable(
  "candidate",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    phone: text("phone"),
    dateOfBirth: timestamp("date_of_birth"),
    address: text("address"),
    position: text("position"),
    status: text("status").default("invited").notNull(), // invited, submitted, reviewing, approved, rejected
    invitedBy: text("invited_by")
      .notNull()
      .references(() => user.id),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
    submittedAt: timestamp("submitted_at"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by").references(() => user.id),
    notes: text("notes"),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [
    index("candidate_organizationId_idx").on(table.organizationId),
    index("candidate_email_idx").on(table.email),
    index("candidate_token_idx").on(table.token),
    index("candidate_status_idx").on(table.status),
  ],
);

export const candidateDocument = pgTable(
  "candidate_document",
  {
    id: text("id").primaryKey(),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => candidate.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // resume, noc, certificate, other
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: text("file_size"),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  },
  (table) => [index("candidate_document_candidateId_idx").on(table.candidateId)],
);

export const candidateRelations = relations(candidate, ({ one, many }) => ({
  organization: one(organization, {
    fields: [candidate.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [candidate.invitedBy],
    references: [user.id],
  }),
  reviewer: one(user, {
    fields: [candidate.reviewedBy],
    references: [user.id],
  }),
  documents: many(candidateDocument),
}));

export const candidateDocumentRelations = relations(candidateDocument, ({ one }) => ({
  candidate: one(candidate, {
    fields: [candidateDocument.candidateId],
    references: [candidate.id],
  }),
}));

// Team Tables
export const team = pgTable(
  "team",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index("team_organizationId_idx").on(table.organizationId),
  ],
);

export const teamMember = pgTable(
  "team_member",
  {
    id: text("id").primaryKey(),
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(), // lead, member
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("team_member_teamId_idx").on(table.teamId),
    index("team_member_userId_idx").on(table.userId),
  ],
);

export const teamRelations = relations(team, ({ one, many }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
  creator: one(user, {
    fields: [team.createdBy],
    references: [user.id],
  }),
  members: many(teamMember),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
}));

// Calendar and Event Tables
export const calendarEvent = pgTable(
  "calendar_event",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => team.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    location: text("location"),
    color: text("color").default("blue").notNull(),
    isAllDay: boolean("is_all_day").default(false).notNull(),
    eventType: text("event_type").default("meeting").notNull(), // meeting, deadline, task, holiday
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("calendar_event_organizationId_idx").on(table.organizationId),
    index("calendar_event_teamId_idx").on(table.teamId),
    index("calendar_event_startTime_idx").on(table.startTime),
  ],
);

export const eventAttendee = pgTable(
  "event_attendee",
  {
    id: text("id").primaryKey(),
    eventId: text("event_id")
      .notNull()
      .references(() => calendarEvent.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").default("pending").notNull(), // pending, accepted, declined
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => [
    index("event_attendee_eventId_idx").on(table.eventId),
    index("event_attendee_userId_idx").on(table.userId),
  ],
);

export const calendarEventRelations = relations(calendarEvent, ({ one, many }) => ({
  organization: one(organization, {
    fields: [calendarEvent.organizationId],
    references: [organization.id],
  }),
  team: one(team, {
    fields: [calendarEvent.teamId],
    references: [team.id],
  }),
  creator: one(user, {
    fields: [calendarEvent.createdBy],
    references: [user.id],
  }),
  attendees: many(eventAttendee),
}));

export const eventAttendeeRelations = relations(eventAttendee, ({ one }) => ({
  event: one(calendarEvent, {
    fields: [eventAttendee.eventId],
    references: [calendarEvent.id],
  }),
  user: one(user, {
    fields: [eventAttendee.userId],
    references: [user.id],
  }),
}));

// Task Management Tables
export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => team.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default("todo").notNull(), // todo, in_progress, review, completed
    priority: text("priority").default("medium").notNull(), // low, medium, high, urgent
    dueDate: timestamp("due_date"),
    assignedTo: text("assigned_to").references(() => user.id),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("task_organizationId_idx").on(table.organizationId),
    index("task_teamId_idx").on(table.teamId),
    index("task_assignedTo_idx").on(table.assignedTo),
    index("task_status_idx").on(table.status),
    index("task_dueDate_idx").on(table.dueDate),
  ],
);

export const taskComment = pgTable(
  "task_comment",
  {
    id: text("id").primaryKey(),
    taskId: text("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("task_comment_taskId_idx").on(table.taskId)],
);

export const taskRelations = relations(task, ({ one, many }) => ({
  organization: one(organization, {
    fields: [task.organizationId],
    references: [organization.id],
  }),
  team: one(team, {
    fields: [task.teamId],
    references: [team.id],
  }),
  assignee: one(user, {
    fields: [task.assignedTo],
    references: [user.id],
  }),
  creator: one(user, {
    fields: [task.createdBy],
    references: [user.id],
  }),
  comments: many(taskComment),
}));

export const taskCommentRelations = relations(taskComment, ({ one }) => ({
  task: one(task, {
    fields: [taskComment.taskId],
    references: [task.id],
  }),
  user: one(user, {
    fields: [taskComment.userId],
    references: [user.id],
  }),
}));
