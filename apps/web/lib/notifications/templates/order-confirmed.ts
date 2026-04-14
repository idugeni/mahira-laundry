import { APP_NAME } from "@/lib/constants";

export function orderConfirmedTemplate(
	orderNumber: string,
	customerName: string,
) {
	return {
		subject: `${APP_NAME} — Order ${orderNumber} Dikonfirmasi`,
		whatsapp: `Halo ${customerName}! 🎉\n\nOrder ${orderNumber} Anda telah dikonfirmasi.\nKami akan segera memproses cucian Anda.\n\nTerima kasih,\n${APP_NAME}`,
		html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a6b4a;">Order Dikonfirmasi ✅</h2>
        <p>Halo <strong>${customerName}</strong>,</p>
        <p>Order <strong>${orderNumber}</strong> telah dikonfirmasi dan akan segera diproses.</p>
        <p style="color: #666; font-size: 14px;">Terima kasih telah menggunakan ${APP_NAME}.</p>
      </div>
    `,
	};
}
