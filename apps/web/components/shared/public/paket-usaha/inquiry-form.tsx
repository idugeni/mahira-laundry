"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitBusinessInquiry } from "@/lib/actions/business-inquiries";
import type { BusinessPackage } from "@/lib/types";

const BUDGET_RANGE_OPTIONS = [
	"< Rp 50 juta",
	"Rp 50 - 100 juta",
	"Rp 100 - 200 juta",
	"> Rp 200 juta",
] as const;

const formSchema = z.object({
	full_name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
	phone: z
		.string()
		.min(1, "Nomor telepon wajib diisi")
		.refine(
			(val) => val.replace(/\D/g, "").length >= 10,
			"Nomor telepon minimal 10 digit",
		),
	email: z.string().email("Format email tidak valid"),
	city: z.string().min(2, "Kota/kabupaten minimal 2 karakter"),
	package_name: z.string().min(1, "Pilih paket yang diminati"),
	budget_range: z.string().optional(),
	message: z
		.string()
		.max(500, "Pesan maksimal 500 karakter")
		.optional()
		.or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface InquiryFormProps {
	defaultPackageName?: string;
	packages: BusinessPackage[];
}

export function InquiryForm({
	defaultPackageName,
	packages,
}: InquiryFormProps) {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			full_name: "",
			phone: "",
			email: "",
			city: "",
			package_name: defaultPackageName ?? "",
			budget_range: "",
			message: "",
		},
	});

	useEffect(() => {
		if (defaultPackageName) {
			form.setValue("package_name", defaultPackageName);
		}
	}, [defaultPackageName, form]);

	async function onSubmit(values: FormValues) {
		setSuccessMessage(null);
		setDuplicateMessage(null);

		const selectedPackage = packages.find(
			(p) => p.name === values.package_name,
		);

		const result = await submitBusinessInquiry({
			package_id: selectedPackage?.id,
			package_name: values.package_name,
			full_name: values.full_name,
			phone: values.phone,
			email: values.email,
			city: values.city,
			budget_range: values.budget_range || undefined,
			message: values.message || undefined,
		});

		if (result.success) {
			setSuccessMessage(
				"Terima kasih! Tim kami akan menghubungi Anda dalam 1x24 jam kerja.",
			);
			form.reset({
				full_name: "",
				phone: "",
				email: "",
				city: "",
				package_name: "",
				budget_range: "",
				message: "",
			});
		} else if (result.error?.includes("sudah mengajukan")) {
			setDuplicateMessage(result.error);
		} else {
			toast.error("Terjadi kesalahan, coba lagi.");
		}
	}

	return (
		<div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
			<h3 className="mb-6 text-xl font-bold text-gray-900">
				Ajukan Inquiry Paket Usaha
			</h3>

			{successMessage && (
				<div className="mb-6 rounded-xl bg-green-50 p-4 text-green-800 font-medium">
					{successMessage}
				</div>
			)}

			{duplicateMessage && (
				<div className="mb-6 rounded-xl bg-yellow-50 p-4 text-yellow-800 font-medium">
					{duplicateMessage}
				</div>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					{/* Full Name */}
					<FormField
						control={form.control}
						name="full_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Nama Lengkap <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Masukkan nama lengkap Anda" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Phone */}
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Nomor Telepon / WhatsApp{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										type="tel"
										placeholder="Contoh: 08123456789"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Email */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Email <span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="contoh@email.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* City */}
					<FormField
						control={form.control}
						name="city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Kota / Kabupaten Domisili{" "}
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input placeholder="Contoh: Surabaya" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Package Name */}
					<FormField
						control={form.control}
						name="package_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Paket yang Diminati <span className="text-red-500">*</span>
								</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Pilih paket" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{packages.map((pkg) => (
											<SelectItem key={pkg.id} value={pkg.name}>
												{pkg.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Budget Range */}
					<FormField
						control={form.control}
						name="budget_range"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Modal yang Disiapkan (opsional)</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value ?? ""}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Pilih kisaran modal" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{BUDGET_RANGE_OPTIONS.map((range) => (
											<SelectItem key={range} value={range}>
												{range}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Message */}
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pesan / Pertanyaan (opsional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Tuliskan pertanyaan atau pesan Anda..."
										className="resize-none"
										rows={4}
										{...field}
									/>
								</FormControl>
								<div className="flex justify-end">
									<span className="text-xs text-gray-400">
										{(field.value ?? "").length}/500
									</span>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
					>
						{form.formState.isSubmitting ? "Mengirim..." : "Kirim Inquiry"}
					</button>
				</form>
			</Form>
		</div>
	);
}
