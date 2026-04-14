import {
	decimal,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const paymentStatusEnum = pgEnum("payment_status", [
	"unpaid",
	"pending",
	"paid",
	"refunded",
	"failed",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
	"cash",
	"qris",
	"bank_transfer",
	"gopay",
	"ovo",
	"dana",
	"shopeepay",
]);

export const payments = pgTable("payments", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
	method: paymentMethodEnum("method").notNull(),
	status: paymentStatusEnum("status").default("unpaid"),
	midtransTransactionId: text("midtrans_transaction_id"),
	midtransOrderId: text("midtrans_order_id"),
	midtransSnapToken: text("midtrans_snap_token"),
	paymentUrl: text("payment_url"),
	paidAt: timestamp("paid_at", { withTimezone: true }),
	expiredAt: timestamp("expired_at", { withTimezone: true }),
	metadata: jsonb("metadata").default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
