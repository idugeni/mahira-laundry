import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { orders } from "@/lib/db/schema/orders";
import { outlets } from "@/lib/db/schema/outlets";
import { profiles } from "@/lib/db/schema/profiles";

export const reviews = pgTable("reviews", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" })
		.unique(),
	customerId: uuid("customer_id")
		.notNull()
		.references(() => profiles.id),
	outletId: uuid("outlet_id")
		.notNull()
		.references(() => outlets.id),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	reply: text("reply"),
	repliedAt: timestamp("replied_at", { withTimezone: true }),
	isPublished: boolean("is_published").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
