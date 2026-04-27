import {
	boolean,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "@/lib/db/schema/profiles";

export const notificationTypeEnum = pgEnum("notification_type", [
	"order_update",
	"payment",
	"delivery",
	"promotion",
	"system",
]);

export const notifications = pgTable("notifications", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => profiles.id, { onDelete: "cascade" }),
	type: notificationTypeEnum("type").notNull(),
	title: text("title").notNull(),
	body: text("body").notNull(),
	data: jsonb("data").default({}),
	isRead: boolean("is_read").default(false),
	readAt: timestamp("read_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
