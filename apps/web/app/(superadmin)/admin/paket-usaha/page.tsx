import { Package } from "lucide-react";
import type { Metadata } from "next";
import { AdminPaketUsahaClient } from "@/components/shared/superadmin/paket-usaha/admin-paket-usaha-client";
import { Badge } from "@/components/ui/badge";
import { getAllBusinessPackages } from "@/lib/actions/business-packages";

export const metadata: Metadata = {
	title: "Paket Usaha Laundry",
	description: "Kelola paket kemitraan usaha laundry Mahira.",
};

export const dynamic = "force-dynamic";

export default async function AdminPaketUsahaPage() {
	const packages = await getAllBusinessPackages();

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-all duration-1000 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-50 text-indigo-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Business Package Management
							</Badge>
						</div>
						<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
							Paket{" "}
							<span className="text-indigo-600 italic">Usaha Laundry</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Kelola paket kemitraan laundry yang ditawarkan kepada calon mitra.
							Atur harga, fitur, dan promo untuk setiap tier paket.
						</p>
					</div>

					<div className="flex items-center gap-6">
						<div className="text-right">
							<p className="text-3xl font-black text-slate-900">
								{packages.length}
							</p>
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Total Paket
							</p>
						</div>
						<div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100">
							<Package size={32} />
						</div>
					</div>
				</div>
			</div>

			{/* Client Component */}
			<AdminPaketUsahaClient packages={packages} />
		</div>
	);
}
