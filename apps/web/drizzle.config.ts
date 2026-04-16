import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./lib/db/schema/*.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: env var is required at build time
		url: process.env.SUPABASE_DB_URL!,
	},
});
