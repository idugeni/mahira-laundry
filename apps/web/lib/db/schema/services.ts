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

export const serviceUnitEnum = pgEnum("service_unit", [
	"kg",
	"item",
	"pasang",
	"meter",
]);

export const services = pgTable("services", {
	id: uuid("id").primaryKey().defaultRandom(),
	outletId: uuid("outlet_id")
		.notNull()
		.references(() => outlets.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	description: text("description"),
	unit: serviceUnitEnum("unit").default("kg"),
	price: decimal("price", { precision: 12, scale: 2 }).notNull(),
	estimatedDurationHours: integer("estimated_duration_hours").default(24),
	icon: text("icon"),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	isExpress: boolean("is_express").default(false),
	expressMultiplier: decimal("express_multiplier", {
		precision: 3,
		scale: 2,
	}).default("1.5"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
