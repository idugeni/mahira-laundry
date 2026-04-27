import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
const connectionString = process.env.SUPABASE_DB_URL!;
// Disable prefetch as it is not supported for "Transaction" pool mode (Supabase standard)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
export type Database = typeof db;
