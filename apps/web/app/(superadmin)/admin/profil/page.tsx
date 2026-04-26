import {
	AlertCircle,
	Bell,
	Camera,
	Globe,
	Lock,
	LogOut,
	Mail,
	Phone,
	Settings2,
	ShieldCheck,
	User,
} from "lucide-react";
import type { Metadata } from "next";
import { AdminAvatarSection } from "@/components/shared/admin/profil/admin-avatar-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient, getUserProfile } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

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

	if (!profile) return null;

	return (
		<div className="space-y-12 pb-20 animate-in fade-in zoom-in-95 slide-in-from-top-12 duration-1000 ease-out">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-all duration-1000 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
					<div className="flex flex-col lg:flex-row items-center gap-10">
						<AdminAvatarSection profile={profile} />

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
								<label
									htmlFor="profil-nama"
									className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
								>
									Nama Lengkap
								</label>
								<div className="relative group">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
									<Input
										id="profil-nama"
										defaultValue={profile?.full_name}
										className="pl-11 pr-4 py-7 bg-slate-50/50 border-slate-50 rounded-2xl font-bold text-sm focus:bg-white transition-all shadow-none"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<label
									htmlFor="profil-email"
									className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
								>
									Email Utama (Read-only)
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
									<Input
										id="profil-email"
										disabled
										defaultValue={authUser?.email || "—"}
										className="pl-11 pr-4 py-7 bg-slate-100 border-slate-100 rounded-2xl font-bold text-sm grayscale opacity-60 shadow-none cursor-not-allowed"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<label
									htmlFor="profil-phone"
									className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
								>
									Kontak Person
								</label>
								<div className="relative group">
									<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
									<Input
										id="profil-phone"
										defaultValue={profile?.phone || "+62 8..."}
										className="pl-11 pr-4 py-7 bg-slate-50/50 border-slate-50 rounded-2xl font-bold text-sm focus:bg-white transition-all shadow-none"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<label
									htmlFor="profil-timezone"
									className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
								>
									Zona Waktu Sistem
								</label>
								<Badge
									id="profil-timezone"
									className="w-full justify-center h-14 rounded-2xl bg-indigo-50/50 border-indigo-100/50 text-indigo-600 text-sm font-black tracking-tight shadow-none border"
								>
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
					<div className="bg-slate-950 rounded-[3.5rem] p-10 lg:p-12 text-white relative overflow-hidden group border border-slate-800 shadow-2xl">
						{/* Animated Cyber Gradients */}
						<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse" />
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full -ml-32 -mb-32 blur-[100px] animate-pulse transition-all duration-1000 group-hover:bg-indigo-500/30" />

						<div className="relative space-y-10 h-full flex flex-col z-10">
							<div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(99,102,241,0.2)] backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
								<span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
									⚡
								</span>
							</div>

							<div className="space-y-4">
								<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/5 backdrop-blur-md rounded-full shadow-inner">
									<div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)] animate-pulse" />
									<span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400/80">
										System High Priority
									</span>
								</div>
								<div>
									<h3 className="text-3xl font-black uppercase tracking-tighter mb-3 leading-none italic">
										Power <span className="text-indigo-500">User</span>
									</h3>
									<p className="text-slate-400 font-bold text-[11px] leading-relaxed max-w-[200px]">
										Otoritas penuh atas infrastruktur{" "}
										<span className="text-white">Mahira Laundry Group</span>.
									</p>
								</div>
							</div>

							<div className="space-y-5 pt-8 mt-auto relative">
								{/* Subtle Gradient Divider */}
								<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

								<div className="flex justify-between items-end">
									<div className="space-y-1">
										<span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
											System Uptime
										</span>
										<p className="text-sm font-black text-indigo-400">
											Operational
										</p>
									</div>
									<span className="text-2xl font-black tracking-tighter">
										99.99<span className="text-xs text-slate-500">%</span>
									</span>
								</div>
								<div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
									<div className="h-full w-[99.9%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
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
