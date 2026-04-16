import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { type, table, record, old_record } = body;

		// Handle different webhook events
		if (table === "orders" && type === "UPDATE") {
			// Send notification on status change
			if (record?.status !== old_record?.status) {
				// TODO: trigger WhatsApp/email notification
			}
		}

		return NextResponse.json({ status: "ok" });
	} catch (error) {
		console.error("[Supabase Webhook] Error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
