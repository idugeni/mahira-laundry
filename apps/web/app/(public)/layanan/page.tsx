import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Layanan Laundry Premium",
	description:
		"Daftar lengkap layanan laundry premium: cuci lipat, cuci setrika, express, dry cleaning, cuci sepatu, dan lainnya dengan standar kualitas tinggi.",
	openGraph: {
		title: "Layanan",
		description:
			"Solusi laundry profesional dengan layanan lengkap. Mulai dari Rp 7.000/kg.",
	},
};

import { Suspense } from "react";
import { LayananClient } from "@/components/shared/public/layanan-client";
import { createClient } from "@/lib/supabase/server";

export default async function LayananPage() {
	const supabase = await createClient();

	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	return (
		<Suspense
			fallback={<div className="py-24 text-center">Memuat Layanan...</div>}
		>
			<LayananClient initialServices={services || []} />
		</Suspense>
	);
}
