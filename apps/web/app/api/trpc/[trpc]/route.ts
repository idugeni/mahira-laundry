import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextResponse } from "next/server";
import { createContext } from "@/server/trpc/proxy";
import { appRouter } from "@/server/trpc/root";
import { apiLimiter } from "@/lib/upstash/rate-limit";

const handler = async (req: Request) => {
	const ip = req.headers.get("x-forwarded-for") ?? "unknown";
	const { success } = await apiLimiter.limit(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext,
	});
};

export { handler as GET, handler as POST };
