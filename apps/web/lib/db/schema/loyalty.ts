import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { profiles } from "./profiles";

export const loyalty = pgTable("loyalty", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id),
  points: integer("points").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  balanceAfter: integer("balance_after").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Loyalty = typeof loyalty.$inferSelect;
export type NewLoyalty = typeof loyalty.$inferInsert;
