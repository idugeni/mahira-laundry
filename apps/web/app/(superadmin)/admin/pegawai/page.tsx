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
	description: "Kelola dan pantau seluruh staf Mahira Laundry Group.",
};

export const dynamic = "force-dynamic";

export default async function PegawaiPage() {
	const [staff, outlets] = await Promise.all([
		getStaffManagementList(),
		getOutletsWithStats(),
	]);

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-none sm:rounded-2xl lg:rounded-[3rem] p-6 sm:p-10 lg:p-14 text-white shadow-2xl shadow-slate-900/20 group">
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
							Kelola seluruh sumber daya manusia Mahira Laundry Group dari satu
							titik kendali tertinggi.
						</p>
					</div>

					<RegisterStaffModal
						outlets={outlets}
						trigger={
							<Button className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-white rounded-2xl px-10 h-16 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5 flex items-center gap-3">
								<UserPlus size={20} /> Tambah Anggota Tim
							</Button>
						}
					/>
				</div>
			</div>

			{/* Filter Section */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="relative group">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
					<Input
						className="pl-11 pr-4 py-6 w-full max-w-sm bg-white rounded-2xl border-slate-100 shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-sm"
						placeholder="Cari nama, email, atau telepon..."
					/>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50"
					>
						{" "}
						Semua{" "}
					</Button>
					<Button
						variant="outline"
						className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50"
					>
						{" "}
						Manager{" "}
					</Button>
					<Button
						variant="outline"
						className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50"
					>
						{" "}
						Kasir{" "}
					</Button>
					<Button
						variant="outline"
						className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50"
					>
						{" "}
						Kurir{" "}
					</Button>
				</div>
			</div>

			{staff.length === 0 ? (
				<div className="bg-white rounded-[4rem] border border-slate-100 p-24 text-center shadow-xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
					<div className="relative">
						<div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-100 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
							<Users size={48} className="text-slate-200" />
						</div>
						<h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
							Kekosongan Tim
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed mx-auto">
							Mahira Laundry Group belum memiliki staf yang terdaftar. Mulai
							bangun tim Anda untuk menggerakkan operasional bisnis.
						</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{staff.map((s) => (
						<div
							key={s.id}
							className="group relative bg-white rounded-none sm:rounded-[3rem] border-b sm:border border-slate-100 p-6 sm:p-8 flex flex-col gap-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden h-full"
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
										<div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center text-2xl font-black text-slate-400 border-2 border-white shadow-lg transition-transform duration-700 group-hover:scale-105">
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
										{(Array.isArray(s.outlets) ? s.outlets[0]?.name : null) ||
											"Unassigned"}
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
			<div className="bg-emerald-50 rounded-[2.5rem] p-8 lg:p-10 border border-emerald-100 flex flex-col lg:flex-row items-center gap-8 shadow-xl shadow-emerald-500/5 transition-transform hover:scale-[1.01] duration-500">
				<div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-lg border-2 border-emerald-100 rotate-3 group-hover:rotate-0 transition-transform">
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
