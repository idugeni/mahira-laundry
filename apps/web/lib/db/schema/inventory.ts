import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { outlets } from "./outlets";

export const inventory = pgTable("inventory", {
	id: uuid("id").primaryKey().defaultRandom(),
	outletId: uuid("outlet_id")
		.notNull()
		.references(() => outlets.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	sku: text("sku"),
	category: text("category"),
	quantity: decimal("quantity", { precision: 10, scale: 2 })
		.notNull()
		.default("0"),
	unit: text("unit").notNull().default("pcs"),
	minStock: decimal("min_stock", { precision: 10, scale: 2 }).default("0"),
	costPerUnit: decimal("cost_per_unit", { precision: 12, scale: 2 }).default(
		"0",
	),
	supplier: text("supplier"),
	lastRestockedAt: timestamp("last_restocked_at", { withTimezone: true }),
	notes: text("notes"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;
