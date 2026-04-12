import { z } from "zod";

export const orderSchema = z.object({
  outletId: z.string().uuid("Outlet harus dipilih"),
  deliveryType: z.enum(["pickup", "delivery", "both"]),
  pickupAddress: z.string().min(1, "Alamat jemput harus diisi").optional(),
  deliveryAddress: z.string().min(1, "Alamat antar harus diisi").optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        serviceId: z.string().uuid(),
        serviceName: z.string(),
        quantity: z.number().min(0.1, "Minimal 0.1"),
        unit: z.enum(["kg", "item", "pasang", "meter"]),
        unitPrice: z.number().min(0),
        isExpress: z.boolean().default(false),
      }),
    )
    .min(1, "Minimal 1 item harus ditambahkan"),
  voucherCode: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export const cancelOrderSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(1, "Alasan pembatalan harus diisi"),
});
