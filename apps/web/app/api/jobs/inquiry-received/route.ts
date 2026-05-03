import { NextResponse } from "next/server";
import { z } from "zod";
import { qstashRoute } from "@/lib/upstash/qstash-route";

const InquiryReceivedPayloadSchema = z.object({
	email: z.string().email(),
	fullName: z.string().min(1).max(120),
	packageName: z.string().max(160).optional(),
});

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

async function handler(request: Request) {
	try {
		const payload = InquiryReceivedPayloadSchema.safeParse(await request.json());
		if (!payload.success) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}

		const { email, fullName, packageName } = payload.data;
		const escapedFullName = escapeHtml(fullName);
		const escapedPackageName = packageName ? escapeHtml(packageName) : "";

		if (!process.env.RESEND_API_KEY) {
			return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
		}

		try {
			await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				},
				body: JSON.stringify({
					from: `${process.env.RESEND_FROM_NAME || "Mahira Laundry"} <${process.env.RESEND_FROM_EMAIL || "noreply@mahiralaundry.id"}>`,
					to: email,
					subject: "Terima kasih atas minat Anda menjadi Mitra Mahira Laundry",
					html: `
						<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
							<h2>Halo ${escapedFullName},</h2>
							<p>Terima kasih atas minat Anda untuk menjadi bagian dari ekosistem Mahira Laundry${escapedPackageName ? ` dengan paket <strong>${escapedPackageName}</strong>` : ""}.</p>
							<p>Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk membahas langkah selanjutnya.</p>
							<p>Salam hangat,<br/>Tim Mahira Laundry</p>
						</div>
					`,
				}),
			});
		} catch (_emailError) {}

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

export const POST = qstashRoute(handler);
