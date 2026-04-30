import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";

async function handler(request: Request) {
	try {
		const body = await request.json();
		const { email, fullName, packageName } = body;

		if (!email || !fullName) {
			return NextResponse.json(
				{ error: "Missing email or fullName" },
				{ status: 400 },
			);
		}

		if (!process.env.RESEND_API_KEY) {
			return NextResponse.json(
				{ error: "RESEND_API_KEY not configured" },
				{ status: 500 },
			);
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
							<h2>Halo ${fullName},</h2>
							<p>Terima kasih atas minat Anda untuk menjadi bagian dari ekosistem Mahira Laundry${packageName ? ` dengan paket <strong>${packageName}</strong>` : ""}.</p>
							<p>Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk membahas langkah selanjutnya.</p>
							<p>Salam hangat,<br/>Tim Mahira Laundry</p>
						</div>
					`,
				}),
			});
		} catch (emailError) {
			console.error("[Inquiry Job] Email send failed:", emailError);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[Inquiry Job] Error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

export const POST = process.env.QSTASH_CURRENT_SIGNING_KEY
	? verifySignatureAppRouter(handler)
	: handler;
