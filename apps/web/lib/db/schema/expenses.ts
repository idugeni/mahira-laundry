import {
	decimal,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { outlets } from "./outlets";
import { profiles } from "./profiles";

export const expenseCategoryEnum = pgEnum("expense_category", [
	"utilities",
	"supplies",
	"rent",
	"salary",
	"marketing",
	"maintenance",
	"other",
]);

export const expenses = pgTable("expenses", {
	id: uuid("id").primaryKey().defaultRandom(),
	outletId: uuid("outlet_id")
		.notNull()
		.references(() => outlets.id, { onDelete: "cascade" }),
	categoryId: expenseCategoryEnum("category").notNull(),
	amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
	title: text("title").notNull(),
	description: text("description"),
	receiptUrl: text("receipt_url"),
	actorId: uuid("actor_id").references(() => profiles.id),
	date: timestamp("date", { withTimezone: true }).defaultNow(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
