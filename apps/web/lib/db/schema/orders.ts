import {
	decimal,
	doublePrecision,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { outlets } from "./outlets";
import { profiles } from "./profiles";

export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"confirmed",
	"picked_up",
	"washing",
	"ironing",
	"ready",
	"delivering",
	"completed",
	"cancelled",
]);

export const deliveryTypeEnum = pgEnum("delivery_type", [
	"pickup",
	"delivery",
	"both",
]);

export const orders = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderNumber: text("order_number").notNull().unique(),
	customerId: uuid("customer_id")
		.notNull()
		.references(() => profiles.id),
	outletId: uuid("outlet_id")
		.notNull()
		.references(() => outlets.id),
	status: orderStatusEnum("status").default("pending"),
	pickupAddress: text("pickup_address"),
	pickupLat: doublePrecision("pickup_lat"),
	pickupLng: doublePrecision("pickup_lng"),
	deliveryAddress: text("delivery_address"),
	deliveryLat: doublePrecision("delivery_lat"),
	deliveryLng: doublePrecision("delivery_lng"),
	deliveryType: deliveryTypeEnum("delivery_type").default("both"),
	deliveryFee: decimal("delivery_fee", { precision: 12, scale: 2 }).default(
		"0",
	),
	subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
	discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
	voucherId: uuid("voucher_id"),
	total: decimal("total", { precision: 12, scale: 2 }).default("0"),
	notes: text("notes"),
	estimatedCompletion: timestamp("estimated_completion", {
		withTimezone: true,
	}),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
	cancelReason: text("cancel_reason"),
	kasirId: uuid("kasir_id").references(() => profiles.id),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
