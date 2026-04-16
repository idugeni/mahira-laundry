"use client";

import { useState } from "react";
import type { BusinessPackage } from "@/lib/types";
import ComparisonTable from "./comparison-table";
import { InquiryForm } from "./inquiry-form";
import { PackageCard } from "./package-card";

interface PaketUsahaClientProps {
	packages: BusinessPackage[];
}

export function PaketUsahaClient({ packages }: PaketUsahaClientProps) {
	const [selectedPackage, setSelectedPackage] =
		useState<BusinessPackage | null>(null);

	function handleInquiry(pkg: BusinessPackage) {
		setSelectedPackage(pkg);
		const el = document.getElementById("inquiry-form");
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	}

	return (
		<div>
			{/* Hero / Header */}
			<section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
						Paket Usaha Laundry Mahira
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
						Mulai bisnis laundry Anda bersama Mahira. Pilih paket yang sesuai
						dengan kebutuhan dan anggaran Anda.
					</p>
				</div>
			</section>

			{/* Package Cards */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					{packages.length === 0 ? (
						<p className="text-center text-gray-500">
							Belum ada paket tersedia saat ini.
						</p>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{packages.map((pkg) => (
								<PackageCard
									key={pkg.id}
									package={pkg}
									onInquiry={handleInquiry}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Comparison Table */}
			{packages.length > 0 && (
				<section className="bg-gray-50 py-16">
					<div className="container mx-auto px-4">
						<h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
							Perbandingan Paket
						</h2>
						<ComparisonTable packages={packages} />
					</div>
				</section>
			)}

			{/* Inquiry Form */}
			<section id="inquiry-form" className="py-16">
				<div className="container mx-auto px-4">
					<h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
						Hubungi Kami
					</h2>
					<InquiryForm
						defaultPackageName={selectedPackage?.name}
						packages={packages}
					/>
				</div>
			</section>
		</div>
	);
}
