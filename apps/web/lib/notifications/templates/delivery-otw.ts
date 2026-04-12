import { APP_NAME } from "@/lib/constants";

export function deliveryOtwTemplate(
  orderNumber: string,
  customerName: string,
  courierName: string,
) {
  return {
    subject: `${APP_NAME} — Order ${orderNumber} Sedang Diantar`,
    whatsapp: `Halo ${customerName}! 🚗\n\nOrder ${orderNumber} sedang diantar oleh kurir ${courierName}.\nSilakan pantau lokasi kurir di aplikasi.\n\nTerima kasih,\n${APP_NAME}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a6b4a;">Dalam Pengantaran 🚗</h2>
        <p>Halo <strong>${customerName}</strong>,</p>
        <p>Order <strong>${orderNumber}</strong> sedang diantar oleh kurir <strong>${courierName}</strong>.</p>
        <p>Silakan pantau lokasi kurir melalui aplikasi.</p>
        <p style="color: #666; font-size: 14px;">Terima kasih telah menggunakan ${APP_NAME}.</p>
      </div>
    `,
  };
}
