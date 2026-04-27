import type { Metadata } from "next";
import { PaketUsahaClient } from "@/components/shared/public/paket-usaha/paket-usaha-client";
import { getActiveBusinessPackages } from "@/lib/actions/business-packages";
import type { BusinessPackage } from "@/lib/types";

export const revalidate = 0;

export const metadata: Metadata = {
	title: "Paket Usaha Laundry Lengkap",
	description:
		"Mulai bisnis laundry Anda bersama Mahira dengan dukungan mesin, pelatihan, dan sistem manajemen terbaik.",
	openGraph: {
		title: "Jual Paket Usaha Laundry Lengkap — Mahira Laundry",
		description:
			"Jual paket usaha laundry lengkap dan terpercaya. Mulai bisnis laundry Anda bersama Mahira dengan dukungan mesin, pelatihan, dan sistem manajemen terbaik.",
		type: "website",
		url: "/paket-usaha",
		siteName: "Mahira Laundry",
		images: [
			{
				url: "/og/paket-usaha.png",
				width: 1200,
				height: 630,
				alt: "Peluang Investasi Paket Usaha Laundry Mahira",
			},
		],
	},
};

import { JsonLd } from "@/components/shared/common/json-ld";

function buildJsonLd(packages: BusinessPackage[]) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: packages.map((pkg, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Product",
				name: pkg.name,
				description: pkg.description ?? undefined,
				offers: {
					"@type": "Offer",
					price: String(pkg.promo_price ?? pkg.price),
					priceCurrency: "IDR",
				},
			},
		})),
	};
}

export default async function PaketUsahaPage() {
	const packages = await getActiveBusinessPackages();
	const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890";
	const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo, saya ingin mengetahui informasi paket usaha laundry Mahira.")}`;

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Beranda",
				item: "https://mahiralaundry.id",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Paket Usaha",
				item: "https://mahiralaundry.id/paket-usaha",
			},
		],
	};

	return (
		<>
			<JsonLd data={buildJsonLd(packages)} />
			<JsonLd data={breadcrumbJsonLd} />

			{packages.length === 0 ? (
				<section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
					<div className="max-w-md">
						<h1 className="mb-3 text-2xl font-bold text-gray-800">
							Paket Sedang Diperbarui
						</h1>
						<p className="mb-6 text-gray-600">
							Paket sedang diperbarui, hubungi kami untuk informasi lebih
							lanjut.
						</p>
						<a
							href={waUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-5 w-5"
								aria-hidden="true"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
								<path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.728.888.924-3.638-.234-.374A9.818 9.818 0 1112 21.818z" />
							</svg>
							Hubungi via WhatsApp
						</a>
					</div>
				</section>
			) : (
				<PaketUsahaClient packages={packages} />
			)}
		</>
	);
}
