import {
	decimal,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { inventory } from "@/lib/db/schema/inventory";
import { profiles } from "@/lib/db/schema/profiles";

export const inventoryLogTypeEnum = pgEnum("inventory_log_type", [
	"in",
	"out",
	"adjustment",
	"damage",
	"return",
]);

export const inventoryLogs = pgTable("inventory_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	inventoryId: uuid("inventory_id")
		.notNull()
		.references(() => inventory.id, { onDelete: "cascade" }),
	type: inventoryLogTypeEnum("type").notNull(),
	quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
	previousQuantity: decimal("previous_quantity", {
		precision: 10,
		scale: 2,
	}).notNull(),
	newQuantity: decimal("new_quantity", { precision: 10, scale: 2 }).notNull(),
	userId: uuid("user_id").references(() => profiles.id),
	notes: text("notes"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type InventoryLog = typeof inventoryLogs.$inferSelect;
export type NewInventoryLog = typeof inventoryLogs.$inferInsert;
