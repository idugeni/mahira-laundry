import {
	Clock,
	MoreVertical,
	Phone,
	Search,
	ShieldCheck,
	User,
	UserPlus,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStaffList } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Manajemen Tim",
	description: "Kelola anggota tim dan peran staff di Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function TimPage() {
	const staff = await getStaffList();

	return (
		<div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* Modern Premium Header */}
			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
							<Users size={20} />
						</div>
						<h1 className="text-4xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight uppercase">
							Manajemen <span className="text-indigo-600">Tim</span>
						</h1>
					</div>
					<p className="text-slate-400 font-bold text-sm tracking-wide uppercase">
						Ditemukan <span className="text-slate-900">{staff.length}</span>{" "}
						staf terdaftar dalam sistem operasional
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<div className="relative group">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
						<Input
							className="pl-11 pr-4 py-6 w-[280px] bg-white rounded-2xl border-slate-100 shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm"
							placeholder="Cari anggota tim..."
						/>
					</div>
					<Button
						type="button"
						className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 h-12 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
					>
						<UserPlus size={16} /> Tambah Staf
					</Button>
				</div>
			</div>

			{staff.length === 0 ? (
				<div className="bg-white rounded-[3rem] border border-slate-100 p-24 text-center shadow-xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
					<div className="relative">
						<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-100 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
							<Users size={40} className="text-slate-200" />
						</div>
						<h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
							Tim Masih Kosong
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-3 max-w-md mx-auto leading-relaxed">
							Tambahkan kasir atau kurir untuk memulai sinkronisasi operasional
							di cabang ini.
						</p>
					</div>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{staff.map((s) => (
						<div
							key={s.id}
							className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col gap-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden"
						>
							{/* Category Glow */}
							<div
								className={cn(
									"absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700",
									s.role === "kasir"
										? "bg-indigo-500"
										: s.role === "superadmin"
											? "bg-amber-500"
											: "bg-emerald-500",
								)}
							/>

							<div className="relative flex items-center justify-between">
								<div className="flex items-center gap-5">
									<div className="relative">
										<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-black text-slate-500 border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
											{s.full_name?.charAt(0) || <User />}
										</div>
										{s.is_active && (
											<span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
										)}
									</div>
									<div className="min-w-0">
										<h3 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate pr-4">
											{s.full_name}
										</h3>
										<Badge
											className={cn(
												"mt-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-none",
												s.role === "kasir"
													? "bg-indigo-50 text-indigo-600"
													: s.role === "superadmin"
														? "bg-amber-50 text-amber-600"
														: "bg-emerald-50 text-emerald-600",
											)}
										>
											{s.role}
										</Badge>
									</div>
								</div>

								<Button
									type="button"
									variant="ghost"
									className="w-10 h-10 p-0 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-slate-600"
								>
									<MoreVertical size={20} />
								</Button>
							</div>

							<div className="space-y-4 pt-6 border-t border-slate-50 relative">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-slate-400">
										<Phone size={14} />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Telepon
										</span>
									</div>
									<span className="text-xs font-bold text-slate-700">
										{s.phone || "—"}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-slate-400">
										<ShieldCheck size={14} />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Otoritas
										</span>
									</div>
									<span className="text-xs font-bold text-slate-700 uppercase">
										{s.role}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 text-slate-400">
										<Clock size={14} />
										<span className="text-[10px] font-black uppercase tracking-widest">
											Bergabung
										</span>
									</div>
									<span className="text-xs font-bold text-slate-700">
										{new Date(s.created_at).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "short",
										})}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 mt-4 relative">
								<Button
									type="button"
									variant="outline"
									className="rounded-2xl h-12 font-black text-[9px] uppercase tracking-widest border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
								>
									Riwayat Tugas
								</Button>
								<Button
									type="button"
									className="rounded-2xl h-12 font-black text-[9px] uppercase tracking-widest bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border-none shadow-none active:scale-95 transition-all"
								>
									Detail Akun
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
