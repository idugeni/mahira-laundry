import { Globe, Layers } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceManager } from "@/components/admin/service-manager";
import { Badge } from "@/components/ui/badge";
import { getAllServices, getUserProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Pusat Layanan",
	description: "Manajemen katalog layanan premium Mahira Laundry Group.",
};

export const dynamic = "force-dynamic";

export default async function SuperadminLayananPage() {
	const [profile, services] = await Promise.all([
		getUserProfile(),
		getAllServices(),
	]);

	const outletId = profile?.outlet_id || "salemba";

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-all duration-1000 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
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
						<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
							Katalog <span className="text-indigo-600 italic">Layanan</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Standardisasi harga, unit, dan durasi pengerjaan layanan di
							seluruh jaringan Mahira Laundry Group. Kelola portofolio produk
							premium Anda dari dashboard ini.
						</p>
					</div>

					<div className="flex items-center gap-6">
						<div className="text-right">
							<p className="text-3xl font-black text-slate-900">
								{services?.length || 0}
							</p>
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Layanan Aktif
							</p>
						</div>
						<div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100">
							<Layers size={32} />
						</div>
					</div>
				</div>
			</div>

			<Suspense
				fallback={
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="h-80 bg-slate-50 rounded-[3rem]" />
						))}
					</div>
				}
			>
				<ServiceManager services={services || []} outletId={outletId} />
			</Suspense>
		</div>
	);
}
