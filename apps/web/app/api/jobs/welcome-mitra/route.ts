import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function handler(request: Request) {
	try {
		const body = await request.json();
		const { userId, outletName, outletId } = body;

		if (!userId || !outletName) {
			return NextResponse.json({ error: "Missing userId or outletName" }, { status: 400 });
		}

		const supabase = await createClient();

		await supabase.from("notifications").insert({
			user_id: userId,
			type: "system",
			title: "Selamat Datang Mitra Mahira!",
			body: `Selamat bergabung di ekosistem Mahira Laundry. Outlet ${outletName} Anda telah berhasil diinisialisasi.`,
			data: { outlet_id: outletId },
		});

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

export const POST = process.env.QSTASH_CURRENT_SIGNING_KEY
	? verifySignatureAppRouter(handler)
	: handler;
