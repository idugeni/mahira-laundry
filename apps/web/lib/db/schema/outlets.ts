import {
	boolean,
	decimal,
	doublePrecision,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const outlets = pgTable("outlets", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	address: text("address").notNull(),
	phone: text("phone"),
	whatsapp: text("whatsapp"),
	email: text("email"),
	latitude: doublePrecision("latitude"),
	longitude: doublePrecision("longitude"),
	operatingHours: jsonb("operating_hours").default({
		weekday: "07:00-21:00",
		weekend: "08:00-20:00",
	}),
	isActive: boolean("is_active").default(true),
	isFranchise: boolean("is_franchise").default(false),
	franchiseFee: decimal("franchise_fee", { precision: 5, scale: 2 }).default(
		"0",
	),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Outlet = typeof outlets.$inferSelect;
export type NewOutlet = typeof outlets.$inferInsert;
