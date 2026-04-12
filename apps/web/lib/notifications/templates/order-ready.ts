import { APP_NAME } from "@/lib/constants";

export function orderReadyTemplate(orderNumber: string, customerName: string) {
  return {
    subject: `${APP_NAME} — Order ${orderNumber} Siap Diambil`,
    whatsapp: `Halo ${customerName}! 👕\n\nOrder ${orderNumber} sudah selesai dan siap diambil/diantar.\n\nTerima kasih,\n${APP_NAME}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a6b4a;">Order Siap Diambil 🧺</h2>
        <p>Halo <strong>${customerName}</strong>,</p>
        <p>Order <strong>${orderNumber}</strong> sudah selesai dan siap diambil atau diantar.</p>
        <p style="color: #666; font-size: 14px;">Terima kasih telah menggunakan ${APP_NAME}.</p>
      </div>
    `,
  };
}
