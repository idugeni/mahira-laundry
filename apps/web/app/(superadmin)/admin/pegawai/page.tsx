import {
	Building2,
	Clock,
	Edit,
	Eye,
	Phone,
	Search,
	Trash2,
	UserPlus,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RegisterStaffModal } from "@/components/shared/admin/staff/register-staff-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	getOutletsWithStats,
	getStaffManagementList,
} from "@/lib/supabase/server";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Manajemen Pegawai",
	description: "Kelola dan pantau seluruh staf Mahira Group.",
};

export const dynamic = "force-dynamic";

type PegawaiSearchParams = Promise<{
	q?: string;
	role?: string;
}>;

const roleTabs = [
	{ label: "Semua", value: "all" },
	{ label: "Manager", value: "manager" },
	{ label: "Kasir", value: "kasir" },
	{ label: "Kurir", value: "kurir" },
];

function getOutletName(
	staff: Awaited<ReturnType<typeof getStaffManagementList>>[number],
) {
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
	const [staff, outlets] = await Promise.all([
		getStaffManagementList(),
		getOutletsWithStats(),
	]);
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
		return queryString ? `/admin/pegawai?${queryString}` : "/admin/pegawai";
	}

	return (
		<div className="space-y-8 sm:space-y-10 pb-16 sm:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
						<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none">
							Manajemen <span className="text-emerald-400 italic">Pegawai</span>
						</h1>
						<p className="text-slate-400 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Kelola seluruh sumber daya manusia Mahira Group dari satu
							titik kendali tertinggi.
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
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<form
					action="/admin/pegawai"
					className="relative group w-full sm:max-w-sm"
				>
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
					{activeRole !== "all" && (
						<input type="hidden" name="role" value={activeRole} />
					)}
					<Input
						name="q"
						defaultValue={params.q ?? ""}
						className="pl-11 pr-4 h-11 w-full bg-white rounded-xl border-slate-100 shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-sm"
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
							Ubah kata kunci atau filter peran untuk melihat daftar pegawai
							lainnya.
						</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
					{filteredStaff.map((s) => (
						<div
							key={s.id}
							className="group relative bg-white rounded-none sm:rounded-2xl border-b sm:border border-slate-100 p-6 flex flex-col gap-6 shadow-lg shadow-slate-200/35 hover:shadow-xl hover:shadow-emerald-500/10 transition-[box-shadow,border-color,background-color] duration-300 overflow-hidden h-full"
						>
							{/* Background Decoration */}
							<div
								className={cn(
									"absolute -right-4 -top-4 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700",
									s.role === "manager"
										? "bg-indigo-500"
										: s.role === "kasir"
											? "bg-amber-500"
											: "bg-emerald-500",
								)}
							/>

							<div className="relative flex items-center justify-between">
								<div className="flex items-center gap-5">
									<div className="relative">
										<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center text-2xl font-black text-slate-400 border-2 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-0.5">
											{s.full_name?.charAt(0) || <Users size={32} />}
										</div>
										<span
											className={cn(
												"absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm",
												s.is_active ? "bg-emerald-500" : "bg-slate-300",
											)}
										/>
									</div>
									<div className="min-w-0">
										<h3 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate pr-4">
											{s.full_name}
										</h3>
										<Badge
											className={cn(
												"mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-none",
												s.role === "manager"
													? "bg-indigo-50 text-indigo-600"
													: s.role === "kasir"
														? "bg-amber-50 text-amber-600"
														: "bg-emerald-50 text-emerald-600",
											)}
										>
											{s.role}
										</Badge>
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<Button
										variant="ghost"
										className="w-10 h-10 p-0 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-emerald-400"
									>
										<Edit size={18} />
									</Button>
									<Button
										variant="ghost"
										className="w-10 h-10 p-0 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500"
									>
										<Trash2 size={18} />
									</Button>
								</div>
							</div>

							<div className="space-y-4 pt-8 border-t border-slate-50 relative flex-1">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-slate-400">
										<Building2 size={14} className="text-emerald-400" />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Penempatan
										</span>
									</div>
									<span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
										{getOutletName(s) || "Unassigned"}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-slate-400">
										<Phone size={14} className="text-emerald-400" />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Kontak
										</span>
									</div>
									<span className="text-xs font-bold text-slate-700">
										{s.phone || "—"}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-slate-400">
										<Clock size={14} className="text-emerald-400" />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Registrasi
										</span>
									</div>
									<span className="text-xs font-bold text-slate-700">
										{formatDate(s.created_at)}
									</span>
								</div>
							</div>

							<div className="relative mt-auto">
								<Button className="w-full bg-slate-50 hover:bg-emerald-500 hover:text-white text-slate-600 rounded-[1.25rem] h-14 font-black text-[10px] uppercase tracking-widest border-none shadow-none group/btn transition-all duration-300">
									<Eye size={16} className="mr-2" /> Detail Profil & Log
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Info footer */}
			<div className="bg-emerald-50 rounded-2xl p-6 sm:p-8 border border-emerald-100 flex flex-col lg:flex-row items-center gap-6 shadow-lg shadow-emerald-500/5 transition-colors hover:bg-white duration-300">
				<div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-emerald-100">
					💡
				</div>
				<div className="text-center lg:text-left flex-1">
					<p className="text-lg font-black text-emerald-900 uppercase tracking-tight mb-2">
						Pusat Informasi SDM
					</p>
					<p className="text-emerald-700/70 font-bold text-sm leading-relaxed max-w-3xl">
						Seluruh kredensial staf Mahira Laundry dikelola dengan enkripsi
						tinggi. Perubahan peran (role) akan berdampak langsung pada hak
						akses aplikasi Kasir dan Kurir di seleruh cabang.
					</p>
				</div>
				<Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10">
					Lihat Panduan
				</Button>
			</div>
		</div>
	);
}
