import {
	boolean,
	decimal,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { services, serviceUnitEnum } from "./services";

export const orderItems = pgTable("order_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	serviceId: uuid("service_id")
		.notNull()
		.references(() => services.id),
	serviceName: text("service_name").notNull(),
	quantity: decimal("quantity", { precision: 10, scale: 2 })
		.notNull()
		.default("1"),
	unit: serviceUnitEnum("unit").notNull(),
	unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
	isExpress: boolean("is_express").default(false),
	subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
