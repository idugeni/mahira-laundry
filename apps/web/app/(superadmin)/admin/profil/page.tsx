import type { Metadata } from "next";
import { getUserProfile, createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
	User,
	ShieldCheck,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Lock,
	Bell,
	Globe,
	Camera,
	Settings2,
	CheckCircle2,
	AlertCircle,
	ArrowRight,
	LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
	title: "Profil Pengguna",
	description: "Kelola profil dan pengaturan akun Superadmin Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function SuperadminProfilPage() {
	const profile = await getUserProfile();
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-all duration-1000 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
					<div className="flex flex-col lg:flex-row items-center gap-10">
						<div className="relative">
							<div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-500/20 border-4 border-white transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3">
								{profile?.full_name?.charAt(0) || <User size={48} />}
							</div>
							<div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-50 flex items-center justify-center text-indigo-600 cursor-pointer hover:bg-slate-50 transition-colors">
								<Camera size={20} />
							</div>
						</div>

						<div className="text-center lg:text-left space-y-4">
							<div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
								<Badge className="bg-indigo-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
									System Authority
								</Badge>
								<span className="text-slate-200">•</span>
								<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
									<Globe size={14} /> ID:{" "}
									{profile?.id?.slice(0, 8).toUpperCase()}
								</span>
							</div>
							<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
								{profile?.full_name || "Superadmin Account"}
							</h1>
							<p className="text-slate-500 font-bold text-sm lg:text-base max-w-xl leading-relaxed">
								Otoritas tertinggi dalam ekosistem Mahira Laundry. Anda memiliki
								akses penuh ke seluruh operasional cabang dan manajemen data.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-10 h-16 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/10 flex items-center gap-4">
							<Settings2 size={20} /> Kelola Token API
						</Button>
						<Button
							variant="outline"
							className="rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest border-rose-100 text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-3"
						>
							<LogOut size={18} /> Keluar Sistem
						</Button>
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-3 gap-10">
				{/* Personal Credentials */}
				<div className="lg:col-span-2 space-y-10">
					<div className="bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-12">
						<div className="flex items-center justify-between border-b border-slate-50 pb-8">
							<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
								<ShieldCheck className="text-indigo-600" size={28} /> Identitas
								& Kredensial
							</h2>
							<Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
								Verified Agent
							</Badge>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
									Nama Lengkap
								</label>
								<div className="relative group">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
									<Input
										defaultValue={profile?.full_name}
										className="pl-11 pr-4 py-7 bg-slate-50/50 border-slate-50 rounded-2xl font-bold text-sm focus:bg-white transition-all shadow-none"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
									Email Utama (Read-only)
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
									<Input
										disabled
										defaultValue={authUser?.email || "—"}
										className="pl-11 pr-4 py-7 bg-slate-100 border-slate-100 rounded-2xl font-bold text-sm grayscale opacity-60 shadow-none cursor-not-allowed"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
									Kontak Person
								</label>
								<div className="relative group">
									<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<Input
										defaultValue={profile?.phone || "+62 8..."}
										className="pl-11 pr-4 py-7 bg-slate-50/50 border-slate-50 rounded-2xl font-bold text-sm focus:bg-white transition-all shadow-none"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
									Zona Waktu Sistem
								</label>
								<Badge className="w-full justify-center h-14 rounded-2xl bg-indigo-50/50 border-indigo-100/50 text-indigo-600 text-sm font-black tracking-tight shadow-none border">
									Asia/Jakarta (GMT+07:00)
								</Badge>
							</div>
						</div>

						<div className="pt-8 border-t border-slate-50 flex items-center justify-end gap-3">
							<Button
								variant="ghost"
								className="rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
							>
								Reset Form
							</Button>
							<Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl h-14 px-12 font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/10 transition-all active:scale-95">
								Simpan Perubahan
							</Button>
						</div>
					</div>

					<div className="bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-10">
						<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
							<Lock className="text-indigo-600" size={28} /> Keamanan & Enkripsi
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							<div className="p-8 rounded-[2rem] border border-amber-100 bg-amber-50/30 space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">
										Two-Factor Auth
									</h4>
									<Badge className="bg-emerald-500 text-white border-none py-1">
										Active
									</Badge>
								</div>
								<p className="text-xs text-slate-500 font-bold leading-relaxed">
									Lapisan keamanan tambahan diaktifkan untuk melindungi otoritas
									superadmin.
								</p>
							</div>
							<div className="flex flex-col gap-4">
								<Button className="w-full rounded-2xl h-14 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10">
									Ganti Password
								</Button>
								<Button
									variant="outline"
									className="w-full rounded-2xl h-14 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400"
								>
									Update Recovery Email
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar Stats / Settings */}
				<div className="space-y-10">
					<div className="bg-indigo-600 rounded-[3rem] p-10 lg:p-12 text-white relative overflow-hidden group">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
						<div className="relative space-y-8 h-full flex flex-col">
							<div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-3xl shadow-2xl">
								⚡
							</div>
							<div>
								<h3 className="text-2xl font-black uppercase tracking-tight mb-2">
									Power User
								</h3>
								<p className="text-indigo-100/70 font-bold text-xs leading-relaxed">
									Anda mengelola{" "}
									{profile?.role === "superadmin" ? "SELUERUH" : "—"}{" "}
									infrastruktur backend Mahira Laundry Group.
								</p>
							</div>
							<div className="space-y-4 pt-4 border-t border-white/10 mt-auto">
								<div className="flex justify-between items-center">
									<span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
										System Uptime
									</span>
									<span className="text-xs font-black">99.99%</span>
								</div>
								<div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
									<div className="h-full w-[99%] bg-white animate-pulse" />
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
						<h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
							<Bell className="text-indigo-600" /> Notifications
						</h3>
						<div className="space-y-6">
							{[
								{
									label: "Alert Audit Log",
									desc: "Notif saat ada data dihapus permanen",
									active: true,
								},
								{
									label: "Laporan Keuangan",
									desc: "Summary mingguan via push",
									active: true,
								},
								{
									label: "Status Infrastruktur",
									desc: "Peringatan downtime sistem",
									active: false,
								},
							].map((item) => (
								<div
									key={item.label}
									className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0"
								>
									<div className="flex-1">
										<p className="font-black text-slate-800 uppercase tracking-tight text-[11px] mb-1">
											{item.label}
										</p>
										<p className="text-[10px] text-slate-400 font-bold">
											{item.desc}
										</p>
									</div>
									<div
										className={cn(
											"w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-500",
											item.active ? "bg-indigo-600" : "bg-slate-100",
										)}
									>
										<div
											className={cn(
												"w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-500",
												item.active ? "translate-x-6" : "translate-x-0",
											)}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col gap-6 items-center text-center">
						<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-md">
							<AlertCircle size={32} />
						</div>
						<div>
							<h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-2">
								Zone Integritas
							</h4>
							<p className="text-[10px] text-slate-400 font-bold leading-relaxed px-4">
								Pastikan Anda tidak membagikan kredensial akses kepada pihak
								manapun demi integritas data Mahira Laundry.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
