import {
  decimal,
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { deliveryTypeEnum, orders } from "./orders";
import { profiles } from "./profiles";

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "assigned",
  "on_the_way",
  "arrived",
  "completed",
  "failed",
]);

export const delivery = pgTable("delivery", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  courierId: uuid("courier_id").references(() => profiles.id),
  type: deliveryTypeEnum("type").notNull(),
  status: deliveryStatusEnum("status").default("assigned"),
  pickupAddress: text("pickup_address"),
  pickupLat: doublePrecision("pickup_lat"),
  pickupLng: doublePrecision("pickup_lng"),
  deliveryAddress: text("delivery_address"),
  deliveryLat: doublePrecision("delivery_lat"),
  deliveryLng: doublePrecision("delivery_lng"),
  currentLat: doublePrecision("current_lat"),
  currentLng: doublePrecision("current_lng"),
  distanceKm: decimal("distance_km", { precision: 8, scale: 2 }),
  fee: decimal("fee", { precision: 12, scale: 2 }).default("0"),
  photoProofUrl: text("photo_proof_url"),
  notes: text("notes"),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Delivery = typeof delivery.$inferSelect;
export type NewDelivery = typeof delivery.$inferInsert;
