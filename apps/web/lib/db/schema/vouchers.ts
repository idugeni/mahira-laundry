import {
	boolean,
	integer,
	numeric,
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
	description: text("description"),
	type: voucherTypeEnum("type").notNull().default("percentage"),
	value: numeric("value", { precision: 12, scale: 2 }).notNull(), // percentage or amount
	min_order: numeric("min_order", { precision: 12, scale: 2 }).default("0"),
	max_discount: numeric("max_discount", { precision: 12, scale: 2 }),
	is_active: boolean("is_active").default(true),
	quota: integer("quota").default(-1), // -1 for unlimited
	used_count: integer("used_count").default(0),
	expiry_date: timestamp("expiry_date", { withTimezone: true }),
	outlet_id: uuid("outlet_id").references(() => outlets.id, {
		onDelete: "cascade",
	}), // null for global
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
