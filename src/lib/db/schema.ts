import { relations } from "drizzle-orm";
import {
  varchar,
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  serial,
  jsonb,
  decimal,
  date,
  time,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  activeOrganizationId: text("active_organization_id"),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  isOnboarded: boolean("is_onboarded").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const members = pgTable("members", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitations = pgTable("invitations", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

// New: sites table
export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  customDomain: text("custom_domain").notNull().unique(),
  subdomain: text("subdomain"),
  type: text("type").notNull(), // "subdomain" or "custom"
  verified: boolean("verified").notNull().default(false), // Whether domain is verified with Vercel
  seoTitle: text("seo_title"), // e.g., "Hotel Sunshine - Best Hotel in Puri"
  seoDescription: text("seo_description"), // e.g., "Book your stay at Hotel Sunshine in Puri, offering beachfront views and top amenities."
  seoKeywords: text("seo_keywords"), // e.g., "Puri hotels, beachfront hotel, Hotel Sunshine"
  ogTitle: text("og_title"), // Open Graph title for social sharing
  ogDescription: text("og_description"), // Open Graph description
  ogImage: text("og_image"), // URL to Open Graph image
  twitterTitle: text("twitter_title"), // Twitter Card title
  twitterDescription: text("twitter_description"), // Twitter Card description
  twitterImage: text("twitter_image"), // URL to Twitter Card image
  settings: jsonb("settings"), // e.g., { logo: "url", favicon: "url", theme: "dark" }
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const organizationRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  sites: many(sites),
}));

export const sitesRelations = relations(sites, ({ one }) => ({
  organization: one(organizations, {
    fields: [sites.organizationId],
    references: [organizations.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  team: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(organizations, {
    fields: [activityLogs.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Organization & {
  teamMembers: (Member & {
    user: Pick<User, "id" | "name" | "email">;
  })[];
};

export enum ActivityType {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  CREATE_TEAM = "CREATE_TEAM",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
  CREATE_BOOKING = "CREATE_BOOKING",
  UPDATE_BOOKING = "UPDATE_BOOKING",
  DELETE_BOOKING = "DELETE_BOOKING",
}
