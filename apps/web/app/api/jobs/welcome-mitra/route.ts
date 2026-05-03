import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { qstashRoute } from "@/lib/upstash/qstash-route";

const WelcomeMitraPayloadSchema = z.object({
	userId: z.string().uuid(),
	outletName: z.string().min(1).max(160),
	outletId: z.string().uuid().optional(),
});

async function handler(request: Request) {
	try {
		const payload = WelcomeMitraPayloadSchema.safeParse(await request.json());
		if (!payload.success) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}

		const { userId, outletName, outletId } = payload.data;
		const supabase = createAdminClient();

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

export const POST = qstashRoute(handler);
