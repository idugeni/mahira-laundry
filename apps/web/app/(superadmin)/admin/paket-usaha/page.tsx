import { Package } from "lucide-react";
import type { Metadata } from "next";
import { AdminPaketUsahaClient } from "@/components/shared/admin/paket-usaha/admin-paket-usaha-client";
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
		<div className="space-y-8 sm:space-y-10 pb-16 sm:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-colors duration-500 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-50 text-indigo-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Business Package Management
							</Badge>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight text-slate-900">
							Paket{" "}
							<span className="text-indigo-600 italic">Usaha Laundry</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Kelola paket kemitraan laundry yang ditawarkan kepada calon mitra.
							Atur harga, fitur, dan promo untuk setiap tier paket.
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-left lg:text-right">
							<p className="text-2xl font-black text-slate-900">
								{packages.length}
							</p>
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Total Paket
							</p>
						</div>
						<div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-md shadow-indigo-100">
							<Package size={24} />
						</div>
					</div>
				</div>
			</div>

			{/* Client Component */}
			<AdminPaketUsahaClient packages={packages} />
		</div>
	);
}
