import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { outlets } from "./outlets";

export const voucherTypeEnum = pgEnum("voucher_type", [
  "percentage",
  "fixed_amount",
  "free_delivery",
]);

export const vouchers = pgTable("vouchers", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  outletId: uuid("outlet_id").references(() => outlets.id),
  type: voucherTypeEnum("type").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  minOrder: decimal("min_order", { precision: 12, scale: 2 }).default("0"),
  maxDiscount: decimal("max_discount", { precision: 12, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
  validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
  isActive: boolean("is_active").default(true),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Voucher = typeof vouchers.$inferSelect;
export type NewVoucher = typeof vouchers.$inferInsert;
