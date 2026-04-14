import { z } from "zod";

export const profileSchema = z.object({
	fullName: z.string().min(2, "Nama minimal 2 karakter"),
	phone: z
		.string()
		.regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor HP Indonesia tidak valid"),
	addresses: z
		.array(
			z.object({
				label: z.string().min(1, "Label alamat harus diisi"),
				address: z.string().min(5, "Alamat minimal 5 karakter"),
				lat: z.number().optional(),
				lng: z.number().optional(),
				isDefault: z.boolean().default(false),
			}),
		)
		.optional(),
});

export const registerSchema = z
	.object({
		fullName: z.string().min(2, "Nama minimal 2 karakter"),
		email: z.string().email("Email tidak valid"),
		phone: z
			.string()
			.regex(
				/^(\+62|62|0)8[1-9][0-9]{6,10}$/,
				"Nomor HP Indonesia tidak valid",
			),
		password: z.string().min(8, "Password minimal 8 karakter"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password tidak cocok",
		path: ["confirmPassword"],
	});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
