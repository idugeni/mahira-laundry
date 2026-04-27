import {
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "@/lib/db/schema/profiles";

export const depositTypeEnum = pgEnum("deposit_type", [
	"topup",
	"payment",
	"refund",
	"adjustment",
]);

export const depositTransactions = pgTable("deposit_transactions", {
	id: uuid("id").primaryKey().defaultRandom(),
	profile_id: uuid("profile_id")
		.references(() => profiles.id, { onDelete: "cascade" })
		.notNull(),
	amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
	type: depositTypeEnum("type").notNull(),
	reference_id: text("reference_id"), // Order ID or Payment ID
	notes: text("notes"),
	actor_id: uuid("actor_id").references(() => profiles.id), // Who processed this (staff/admin)
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
