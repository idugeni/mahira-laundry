import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { outlets } from "./outlets";

export const machineTypeEnum = pgEnum("machine_type", [
	"washer",
	"dryer",
	"steamer",
	"other",
]);
export const machineStatusEnum = pgEnum("machine_status", [
	"available",
	"in_use",
	"maintenance",
	"broken",
]);

export const machines = pgTable("machines", {
	id: uuid("id").primaryKey().defaultRandom(),
	outletId: uuid("outlet_id")
		.notNull()
		.references(() => outlets.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	type: machineTypeEnum("type").notNull(),
	status: machineStatusEnum("status").default("available"),
	capacityKg: integer("capacity_kg"),
	brand: text("brand"),
	lastMaintenance: timestamp("last_maintenance", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Machine = typeof machines.$inferSelect;
export type NewMachine = typeof machines.$inferInsert;
