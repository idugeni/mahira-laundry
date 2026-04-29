import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { orderId, newStatus, customerPhone, customerName } = body;

		if (!orderId || !newStatus) {
			return NextResponse.json(
				{ error: "Missing orderId or newStatus" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

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
			user_id: body.customerId,
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
			} catch (waError) {
				console.error("[Notify Job] WhatsApp send failed:", waError);
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[Notify Job] Error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
