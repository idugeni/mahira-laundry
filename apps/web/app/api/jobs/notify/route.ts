import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { qstashRoute } from "@/lib/upstash/qstash-route";

const NotifyPayloadSchema = z.object({
	orderId: z.string().min(1).max(80),
	newStatus: z.enum([
		"confirmed",
		"picked_up",
		"washing",
		"ironing",
		"ready",
		"delivering",
		"completed",
		"cancelled",
	]),
	customerId: z.string().uuid(),
	customerPhone: z.string().min(6).max(32).optional(),
	customerName: z.string().max(120).optional(),
});

async function handler(request: Request) {
	try {
		const payload = NotifyPayloadSchema.safeParse(await request.json());
		if (!payload.success) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}

		const { orderId, newStatus, customerId, customerPhone, customerName } = payload.data;
		const supabase = createAdminClient();

		const statusMessages: Record<string, string> = {
			confirmed: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda telah dikonfirmasi. Kami akan segera memprosesnya.`,
			picked_up: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda telah dijemput dan sedang dalam proses.`,
			washing: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda sedang dicuci.`,
			ironing: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda sedang disetrika.`,
			ready: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda sudah selesai dan siap diambil! 🎉`,
			delivering: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda sedang dalam pengiriman.`,
			completed: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda telah selesai. Terima kasih telah mempercayakan laundry Anda kepada Mahira! 🙏`,
			cancelled: `Halo ${customerName || "Pelanggan"}, pesanan #${orderId} Anda telah dibatalkan.`,
		};

		const message = statusMessages[newStatus];
		if (!message) {
			return NextResponse.json(
				{ error: `No message template for status: ${newStatus}` },
				{ status: 400 },
			);
		}

		await supabase.from("notifications").insert({
			user_id: customerId,
			type: "order_update",
			title: `Pesanan ${newStatus === "completed" ? "Selesai" : "Update"}`,
			body: message,
			data: { order_id: orderId, status: newStatus },
		});

		if (customerPhone && process.env.FONNTE_API_KEY) {
			try {
				await fetch("https://api.fonnte.com/send", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: process.env.FONNTE_API_KEY,
					},
					body: JSON.stringify({
						target: customerPhone,
						message,
					}),
				});
			} catch (_waError) {}
		}

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

export const POST = qstashRoute(handler);
