import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { outlets } from "./outlets";

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "kasir",
  "kurir",
  "manager",
  "superadmin",
]);
export const loyaltyTierEnum = pgEnum("loyalty_tier", [
  "bronze",
  "silver",
  "gold",
  "platinum",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("customer"),
  outletId: uuid("outlet_id").references(() => outlets.id),
  loyaltyTier: loyaltyTierEnum("loyalty_tier").default("bronze"),
  loyaltyPoints: integer("loyalty_points").default(0),
  referralCode: text("referral_code").unique(),
  referredBy: uuid("referred_by"),
  addresses: jsonb("addresses").default([]),
  notificationPreferences: jsonb("notification_preferences").default({
    whatsapp: true,
    email: true,
    push: true,
  }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
