import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";

type AppRouteHandler = (request: Request) => Response | Promise<Response>;

export function qstashRoute(handler: AppRouteHandler): AppRouteHandler {
	const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
	const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY ?? currentSigningKey;

	if (!currentSigningKey || !nextSigningKey) {
		return async () =>
			NextResponse.json({ error: "QStash signing keys not configured" }, { status: 503 });
	}

	return verifySignatureAppRouter(handler, {
		currentSigningKey,
		nextSigningKey,
	}) as AppRouteHandler;
}
