import { Search, UserPlus, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RegisterStaffModal } from "@/components/shared/admin/staff/register-staff-modal";
import { StaffGridClient } from "@/components/shared/admin/staff/staff-grid-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOutletsWithStats, getStaffManagementList } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Manajemen Pegawai",
	description: "Kelola dan pantau seluruh staf Mahira Group.",
};

export const dynamic = "force-dynamic";

type PegawaiSearchParams = Promise<{
	q?: string;
	role?: string;
}>;

const PEGAWAI_PATH = "/admin/pegawai" as const;

const roleTabs = [
	{ label: "Semua", value: "all" },
	{ label: "Manager", value: "manager" },
	{ label: "Kasir", value: "kasir" },
	{ label: "Kurir", value: "kurir" },
];

function getOutletName(staff: Awaited<ReturnType<typeof getStaffManagementList>>[number]) {
	return (Array.isArray(staff.outlets) ? staff.outlets[0]?.name : null) || "";
}

export default async function PegawaiPage({
	searchParams,
}: {
	searchParams?: PegawaiSearchParams;
}) {
	const params = (await searchParams) ?? {};
	const query = (params.q ?? "").trim().toLowerCase();
	const activeRole = roleTabs.some((tab) => tab.value === params.role)
		? (params.role as string)
		: "all";
	const [staff, outlets] = await Promise.all([getStaffManagementList(), getOutletsWithStats()]);
	const filteredStaff = staff.filter((s) => {
		const matchesRole = activeRole === "all" || s.role === activeRole;
		const outletName = getOutletName(s);
		const haystack = [s.full_name, s.phone, outletName, s.role]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		return matchesRole && (!query || haystack.includes(query));
	});

	function roleHref(role: string) {
		const nextParams = new URLSearchParams();
		if (query) nextParams.set("q", query);
		if (role !== "all") nextParams.set("role", role);
		const queryString = nextParams.toString();
		return queryString ? `${PEGAWAI_PATH}?${queryString}` : PEGAWAI_PATH;
	}

	return (
		<div className="space-y-8 sm:space-y-10  animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-slate-900/20 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full -ml-20 -mb-20 blur-3xl" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Administrasi Pusat
							</Badge>
							<span className="text-slate-500">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								{staff.length} Staf Terdaftar
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none">
							Manajemen <span className="text-emerald-400 italic">Pegawai</span>
						</h1>
						<p className="text-slate-400 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Kelola seluruh sumber daya manusia Mahira Group dari satu titik kendali tertinggi.
						</p>
					</div>

					<RegisterStaffModal
						outlets={outlets}
						trigger={
							<Button className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-slate-950 rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-white/5 flex items-center gap-2.5">
								<UserPlus size={20} /> Tambah Anggota Tim
							</Button>
						}
					/>
				</div>
			</div>

			{/* Filter Section */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<form action={PEGAWAI_PATH} className="relative group w-full lg:max-w-sm">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
					{activeRole !== "all" && <input type="hidden" name="role" value={activeRole} />}
					<Input
						name="q"
						defaultValue={params.q ?? ""}
						className="pl-11 pr-4 h-11 w-full bg-white rounded-xl border-slate-100 shadow-xs focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-sm"
						placeholder="Cari nama, telepon, outlet, atau role..."
					/>
				</form>
				<div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
					{roleTabs.map((tab) => (
						<Button
							key={tab.value}
							asChild
							variant="outline"
							className={cn(
								"rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shrink-0",
								activeRole === tab.value &&
									"bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
							)}
						>
							<Link href={roleHref(tab.value)}>{tab.label}</Link>
						</Button>
					))}
				</div>
			</div>

			{filteredStaff.length === 0 ? (
				<div className="bg-white rounded-2xl border border-slate-100 p-10 sm:p-14 text-center shadow-lg shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
					<div className="relative">
						<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-dashed border-slate-100 transition-transform duration-300 group-hover:-translate-y-0.5">
							<Users size={36} className="text-slate-200" />
						</div>
						<h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
							Data Tidak Ditemukan
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed mx-auto">
							Ubah kata kunci atau filter peran untuk melihat daftar pegawai lainnya.
						</p>
					</div>
				</div>
			) : (
				<StaffGridClient staff={filteredStaff} />
			)}
		</div>
	);
}
