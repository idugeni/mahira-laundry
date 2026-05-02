import {
	AlertCircle,
	Bell,
	LogOut,
	Mail,
	Phone,
	Settings2,
	ShieldCheck,
	User,
} from "lucide-react";
import type { Metadata } from "next";
import { AdminAvatarSection } from "@/components/shared/admin/profil/admin-avatar-section";
import { AdminSecuritySection } from "@/components/shared/admin/profil/admin-security-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { createClient, getUserProfile } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Profil Pengguna",
	description: `Kelola profil dan pengaturan akun ${APP_NAME}.`,
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
		<div className="space-y-8 sm:space-y-10  animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
			{/* Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-colors duration-500 group-hover:bg-indigo-100" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
						<AdminAvatarSection profile={profile} />

						<div className="text-center lg:text-left space-y-4">
							<div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
								<Badge className="bg-indigo-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
									{profile.role}
								</Badge>
								<span className="text-slate-200">•</span>
								<span className="text-slate-400 text-sm font-bold flex items-center gap-2">
									<Mail size={14} /> {authUser?.email || profile?.email || "—"}
								</span>
							</div>
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight text-slate-900">
								{profile?.full_name || "—"}
							</h1>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10 flex items-center gap-2.5">
							<Settings2 size={20} /> Kelola Token API
						</Button>
						<form action="/api/auth/signout" method="POST">
							<Button
								type="submit"
								variant="outline"
								className="rounded-xl h-11 px-5 font-black text-xs uppercase tracking-widest border-rose-100 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 w-full"
							>
								<LogOut size={18} /> Keluar Sistem
							</Button>
						</form>
					</div>
				</div>
			</div>

			<div className="grid md:grid-cols-3 gap-5 sm:gap-6">
				{/* Personal Credentials */}
				<div className="lg:col-span-2 space-y-6">
					<div className="bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/35 space-y-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-50 pb-6">
							<h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
								<ShieldCheck className="text-indigo-600" size={28} /> Identitas
								& Kredensial
							</h2>
							{profile.is_active && (
								<Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
									Aktif
								</Badge>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
										className="pl-11 pr-4 h-11 bg-slate-50/50 border-slate-100 rounded-xl font-bold text-sm focus:bg-white transition-all shadow-none"
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
										className="pl-11 pr-4 h-11 bg-slate-100 border-slate-100 rounded-xl font-bold text-sm grayscale opacity-60 shadow-none cursor-not-allowed"
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
										className="pl-11 pr-4 h-11 bg-slate-50/50 border-slate-100 rounded-xl font-bold text-sm focus:bg-white transition-all shadow-none"
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
									className="w-full justify-center h-11 rounded-xl bg-indigo-50/50 border-indigo-100/50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/50 dark:border-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-300 dark:hover:text-indigo-950 text-sm font-black tracking-tight shadow-none border transition-colors duration-300 cursor-default"
								>
									{Intl.DateTimeFormat().resolvedOptions().timeZone}
								</Badge>
							</div>
						</div>

						<div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
							<Button
								variant="ghost"
								className="rounded-xl h-11 px-5 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700"
							>
								Reset Form
							</Button>
							<Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/10">
								Simpan Perubahan
							</Button>
						</div>
					</div>

					<AdminSecuritySection
						email={authUser?.email || profile?.email || ""}
					/>
				</div>

				{/* Sidebar Settings */}
				<div className="space-y-6">
					<div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-lg shadow-slate-200/35 space-y-6">
						<h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
							<Bell className="text-indigo-600" /> Notifikasi
						</h3>
						<div className="space-y-6">
							{[
								{
									key: "whatsapp" as const,
									label: "WhatsApp",
									desc: "Notifikasi pesanan via WhatsApp",
								},
								{
									key: "email" as const,
									label: "Email",
									desc: "Ringkasan & laporan via email",
								},
								{
									key: "push" as const,
									label: "Push Notification",
									desc: "Notifikasi real-time di browser",
								},
							].map((item) => {
								const active =
									profile.notification_preferences?.[item.key] ?? true;
								return (
									<div
										key={item.key}
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
												active ? "bg-indigo-600" : "bg-slate-100",
											)}
										>
											<div
												className={cn(
													"w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-500",
													active ? "translate-x-6" : "translate-x-0",
												)}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 flex flex-col gap-5 items-center text-center">
						<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-md">
							<AlertCircle size={32} />
						</div>
						<div>
							<h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-2">
								Zone Integritas
							</h4>
							<p className="text-[10px] text-slate-400 font-bold leading-relaxed px-4">
								Pastikan Anda tidak membagikan kredensial akses kepada pihak
								manapun demi integritas data {APP_NAME}.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
