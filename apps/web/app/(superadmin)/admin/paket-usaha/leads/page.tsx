import { Users } from "lucide-react";
import type { Metadata } from "next";
import { AdminLeadsClient } from "@/components/shared/admin/paket-usaha/leads/admin-leads-client";
import { Badge } from "@/components/ui/badge";
import { getBusinessInquiries } from "@/lib/actions/business-inquiries";
import { getInquiryStats } from "@/lib/supabase/server";
import type { InquiryFilters, InquiryStatus } from "@/lib/types";

export const metadata: Metadata = {
	title: "Leads Paket Usaha",
	description: "Kelola inquiry dan leads calon mitra usaha laundry.",
};

export const dynamic = "force-dynamic";

interface AdminLeadsPageProps {
	searchParams: Promise<{
		status?: string;
		package_name?: string;
		date_from?: string;
		date_to?: string;
	}>;
}

export default async function AdminLeadsPage({
	searchParams,
}: AdminLeadsPageProps) {
	const params = await searchParams;

	const filters: InquiryFilters = {};
	if (params.status) filters.status = params.status as InquiryStatus;
	if (params.package_name) filters.package_name = params.package_name;
	if (params.date_from) filters.date_from = params.date_from;
	if (params.date_to) filters.date_to = params.date_to;

	const [leads, stats] = await Promise.all([
		getBusinessInquiries(filters),
		getInquiryStats(),
	]);

	return (
		<div className="space-y-8 sm:space-y-10  animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-colors duration-500 group-hover:bg-emerald-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Leads Management
							</Badge>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight text-slate-900">
							Leads <span className="text-emerald-600 italic">Paket Usaha</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Kelola inquiry dari calon mitra usaha laundry. Pantau status,
							lakukan follow-up, dan konversi leads menjadi mitra aktif.
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="text-left lg:text-right">
							<p className="text-2xl font-black text-slate-900">{stats.new}</p>
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Leads Baru
							</p>
						</div>
						<div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-100">
							<Users size={24} />
						</div>
					</div>
				</div>
			</div>

			{/* Client Component */}
			<AdminLeadsClient leads={leads} stats={stats} />
		</div>
	);
}
