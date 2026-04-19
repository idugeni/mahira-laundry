"use client";

import {
	AlertCircle,
	Briefcase,
	Building2,
	Lock,
	Mail,
	Phone,
	Save,
	ShieldCheck,
	Trash2,
	User,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { RegisterStaffInput } from "@/lib/actions/staff";
import { deleteStaffMember, registerStaffMember } from "@/lib/actions/staff";
import type { Outlet, Profile } from "@/lib/types";

interface RegisterStaffModalProps {
	staff?: Profile;
	outlets: Outlet[];
	trigger?: React.ReactNode;
}

export function RegisterStaffModal({
	staff,
	outlets,
	trigger,
}: RegisterStaffModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [mounted, setMounted] = useState(false);
	const [role, setRole] = useState<string>(staff?.role || "kasir");
	const [outletId, setOutletId] = useState<string>(staff?.outlet_id || "");

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleDelete() {
		if (!staff) return;
		if (
			!confirm(
				`Hapus akses ${staff.full_name || "staf ini"} dari sistem secara permanen?`,
			)
		)
			return;
		setIsLoading(true);
		const result = await deleteStaffMember(staff.id);
		if (result.success) {
			toast.success("Kredensial staf telah dicabut dan dihapus.");
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal mencabut akses.");
		}
		setIsLoading(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const data = {
			id: staff?.id,
			fullName: formData.get("fullName") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			role: role as RegisterStaffInput["role"],
			outletId: outletId,
			password: (formData.get("password") as string) || undefined,
		};

		const result = await registerStaffMember(data);

		if (result.success) {
			toast.success(
				staff
					? "Data tim berhasil disinkronisasi"
					: "Anggota tim baru telah aktif",
			);
			setIsOpen(false);
		} else {
			setError(
				result.error || "Interupsi sistem: Gagal mendaftarkan unit SDM.",
			);
			toast.error("Registrasi gagal. Periksa kembali data.");
		}
		setIsLoading(false);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="contents"
			>
				{trigger || (
					<Button className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-white rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5 flex items-center gap-3">
						<UserPlus size={18} /> Registrasi Staf
					</Button>
				)}
			</button>

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300"
							onClick={() => !isLoading && setIsOpen(false)}
						/>

						<div className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
							{/* Premium Header */}
							<div className="px-10 pt-10 pb-8 bg-slate-50 relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl transition-transform duration-1000 group-hover:scale-110" />

								<div className="relative flex items-center justify-between">
									<div className="space-y-2">
										<Badge className="bg-emerald-600 text-white border-none py-0.5 text-[8px] font-black uppercase tracking-[0.2em]">
											Human Resource Admin
										</Badge>
										<h2 className="text-3xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
											{staff ? "Update" : "Registrasi"}{" "}
											<span className="text-emerald-500 italic">Staf</span>
										</h2>
										<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
											Manajemen Kredensial & Akses Mahira Group
										</p>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-500"
									>
										<X size={20} />
									</button>
								</div>
							</div>

							<div className="flex-1 overflow-y-auto custom-scrollbar">
								<form onSubmit={handleSubmit} className="p-10 space-y-8">
									{error && (
										<div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-4 animate-in shake-1 duration-300">
											<AlertCircle size={20} />
											{error}
										</div>
									)}

									<div className="space-y-2">
										<label
											htmlFor="staff-fullname"
											className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
										>
											Nama Lengkap Tim
										</label>
										<div className="relative group/input">
											<User className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
											<input
												required
												id="staff-fullname"
												name="fullName"
												defaultValue={staff?.full_name}
												placeholder="Contoh: Muhammad Rafli"
												className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
											/>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-6">
										<div className="space-y-2">
											<label
												htmlFor="staff-email"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
											>
												Email Corporate
											</label>
											<div className="relative group/input">
												<Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
												<input
													required
													type="email"
													id="staff-email"
													name="email"
													defaultValue={staff?.email ?? ""} // Note: This might need careful handling if email changes
													placeholder="staf@mahira.id"
													className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="staff-phone"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
											>
												Koneksi WhatsApp
											</label>
											<div className="relative group/input">
												<Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
												<input
													required
													id="staff-phone"
													name="phone"
													defaultValue={staff?.phone ?? ""}
													placeholder="0812..."
													className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
												/>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-6">
										<div className="space-y-2">
											<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
												Otoritas Peran
											</p>
											<Select value={role} onValueChange={setRole}>
												<SelectTrigger className="px-5 h-16 rounded-2xl border-slate-50 bg-slate-50 focus:bg-white font-bold text-sm transition-all shadow-none">
													<div className="flex items-center gap-3">
														<Briefcase size={18} className="text-emerald-400" />
														<SelectValue placeholder="Pilih Peran" />
													</div>
												</SelectTrigger>
												<SelectContent className="rounded-3xl border-slate-100 shadow-2xl p-2">
													<SelectItem
														value="kasir"
														className="rounded-xl py-3 font-bold text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer"
													>
														Kasir Operasional
													</SelectItem>
													<SelectItem
														value="kurir"
														className="rounded-xl py-3 font-bold text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer"
													>
														Kurir Penjemputan
													</SelectItem>
													<SelectItem
														value="manager"
														className="rounded-xl py-3 font-bold text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer"
													>
														Manager Cabang
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
												Penempatan Unit
											</p>
											<Select value={outletId} onValueChange={setOutletId}>
												<SelectTrigger className="px-5 h-16 rounded-2xl border-slate-50 bg-slate-50 focus:bg-white font-bold text-sm transition-all shadow-none">
													<div className="flex items-center gap-3">
														<Building2 size={18} className="text-emerald-400" />
														<SelectValue placeholder="Pilih Outlet" />
													</div>
												</SelectTrigger>
												<SelectContent className="rounded-3xl border-slate-100 shadow-2xl p-2">
													{outlets.map((o) => (
														<SelectItem
															key={o.id}
															value={o.id}
															className="rounded-xl py-3 font-bold text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer"
														>
															{o.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between mx-1">
											<label
												htmlFor="staff-password"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
											>
												Security Password
											</label>
											{!staff && (
												<Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
													Def: Mahira123!
												</Badge>
											)}
										</div>
										<div className="relative group/input">
											<Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
											<input
												id="staff-password"
												type="password"
												name="password"
												placeholder={
													staff
														? "Isi hanya jika ingin mengganti password"
														: "Kosongkan untuk password default"
												}
												className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
											/>
										</div>
									</div>

									<div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
										{staff && (
											<Button
												type="button"
												variant="ghost"
												onClick={handleDelete}
												disabled={isLoading}
												className="w-full sm:w-auto px-6 h-16 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2"
											>
												<Trash2 size={18} /> Cabut Akses
											</Button>
										)}
										<div className="flex-1" />
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsOpen(false)}
											disabled={isLoading}
											className="w-full sm:w-auto h-16 px-10 rounded-2xl border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
										>
											Batal
										</Button>
										<Button
											type="submit"
											disabled={isLoading}
											className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.15em] shadow-2xl shadow-slate-900/10 hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-3"
										>
											{isLoading ? (
												<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											) : (
												<Save size={18} />
											)}
											{staff ? "Update Credentials" : "Initialize Agent"}
										</Button>
									</div>
								</form>
							</div>

							{/* Standard Warning Footer */}
							<div className="bg-emerald-50 px-10 py-6 border-t border-emerald-100 flex items-center gap-4">
								<div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
									<ShieldCheck size={20} />
								</div>
								<p className="text-[10px] font-bold text-emerald-700/80 leading-relaxed uppercase tracking-widest">
									Seluruh akses staf dipantau oleh sistem audit keamanan Mahira
									Laundry. Pastikan data akun valid.
								</p>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
