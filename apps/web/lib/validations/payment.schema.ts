import { z } from "zod";

export const paymentSchema = z.object({
	orderId: z.string().uuid(),
	method: z.enum([
		"cash",
		"qris",
		"bank_transfer",
		"gopay",
		"ovo",
		"dana",
		"shopeepay",
	]),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
