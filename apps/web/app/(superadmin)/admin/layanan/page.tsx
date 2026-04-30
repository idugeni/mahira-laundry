import { Globe, Layers } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceManager } from "@/components/admin/service-manager";
import { Badge } from "@/components/ui/badge";
import { getAllServices, getUserProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Pusat Layanan",
	description: "Manajemen katalog layanan premium Mahira Group.",
};

export const dynamic = "force-dynamic";

export default async function SuperadminLayananPage() {
	const [profile, services] = await Promise.all([
		getUserProfile(),
		getAllServices(),
	]);

	const outletId = profile?.outlet_id || "jatiwaringin";

	return (
		<div className="space-y-8 sm:space-y-10 pb-16 sm:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-colors duration-500 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-50 text-indigo-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Product Management
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Globe size={14} /> Global Catalogue
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight text-slate-900">
							Katalog <span className="text-indigo-600 italic">Layanan</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Standardisasi harga, unit, dan durasi pengerjaan layanan di
							seluruh jaringan Mahira Group. Kelola portofolio produk
							premium Anda dari dashboard ini.
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-left lg:text-right">
							<p className="text-2xl font-black text-slate-900">
								{services?.length || 0}
							</p>
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Layanan Aktif
							</p>
						</div>
						<div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-md shadow-indigo-100">
							<Layers size={24} />
						</div>
					</div>
				</div>
			</div>

			<Suspense
				fallback={
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 animate-pulse">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="h-72 bg-slate-50 rounded-2xl" />
						))}
					</div>
				}
			>
				<ServiceManager services={services || []} outletId={outletId} />
			</Suspense>
		</div>
	);
}
