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
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

export function RegisterStaffModal({ staff, outlets, trigger }: RegisterStaffModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [mounted, setMounted] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [role, setRole] = useState<RegisterStaffInput["role"]>(
		staff?.role === "manager" || staff?.role === "kurir" ? staff.role : "kasir",
	);
	const [outletId, setOutletId] = useState<string>(staff?.outlet_id || "");

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleDelete() {
		if (!staff) return;
		setIsLoading(true);
		const result = await deleteStaffMember(staff.id);
		if (result.success) {
			toast.success("Kredensial staf telah dicabut dan dihapus.");
			setShowDeleteConfirm(false);
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
			toast.success(staff ? "Data tim berhasil disinkronisasi" : "Anggota tim baru telah aktif");
			setIsOpen(false);
		} else {
			setError(result.error || "Interupsi sistem: Gagal mendaftarkan unit SDM.");
			toast.error("Registrasi gagal. Periksa kembali data.");
		}
		setIsLoading(false);
	}

	return (
		<>
			{React.isValidElement(trigger) ? (
				(() => {
					const typedTrigger = trigger as React.ReactElement<{
						onClick?: (e: React.MouseEvent) => void;
					}>;
					const existingOnClick = typedTrigger.props.onClick;
					return React.cloneElement(typedTrigger, {
						onClick: (e: React.MouseEvent) => {
							existingOnClick?.(e);
							setIsOpen(true);
						},
					});
				})()
			) : (
				<Button
					onClick={() => setIsOpen(true)}
					className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-slate-950 rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-white/5 flex items-center gap-2.5"
				>
					<UserPlus size={18} /> Registrasi Staf
				</Button>
			)}

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300"
							onClick={() => !isLoading && setIsOpen(false)}
						/>

						<div className="relative bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 border border-white/20">
							{/* Premium Header */}
							<div className="px-6 sm:px-8 pt-7 sm:pt-8 pb-6 bg-slate-50 relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

								<div className="relative flex items-center justify-between">
									<div className="space-y-2">
										<Badge className="bg-emerald-600 text-white border-none py-0.5 text-[8px] font-black uppercase tracking-[0.2em]">
											Human Resource Admin
										</Badge>
										<h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
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
										className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
									>
										<X size={20} />
									</button>
								</div>
							</div>

							<div className="flex-1 overflow-y-auto custom-scrollbar">
								<form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
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
												className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-hidden"
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
													className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-hidden"
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
													className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-hidden"
												/>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div className="space-y-2">
											<label
												htmlFor="staff-role"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
											>
												Otoritas Peran
											</label>
											<Select
												value={role}
												onValueChange={(value: RegisterStaffInput["role"]) => setRole(value)}
											>
												<SelectTrigger id="staff-role">
													<div className="flex items-center gap-3">
														<Briefcase size={18} className="text-emerald-400" />
														<SelectValue placeholder="Pilih Peran" />
													</div>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="kasir">Kasir Operasional</SelectItem>
													<SelectItem value="kurir">Kurir Penjemputan</SelectItem>
													<SelectItem value="manager">Manager Cabang</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<label
												htmlFor="staff-outlet"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
											>
												Penempatan Unit
											</label>
											<Select value={outletId} onValueChange={setOutletId}>
												<SelectTrigger id="staff-outlet">
													<div className="flex items-center gap-3">
														<Building2 size={18} className="text-emerald-400" />
														<SelectValue placeholder="Pilih Outlet" />
													</div>
												</SelectTrigger>
												<SelectContent>
													{outlets.map((o) => (
														<SelectItem key={o.id} value={o.id}>
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
												className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all outline-hidden"
											/>
										</div>
									</div>

									<div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
										{staff && (
											<Button
												type="button"
												variant="ghost"
												onClick={() => setShowDeleteConfirm(true)}
												disabled={isLoading}
												className="w-full sm:w-auto px-5 h-11 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-black text-[10px] uppercase tracking-widest shadow-xs flex items-center gap-2"
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
											className="w-full sm:w-auto h-11 px-6 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50"
										>
											Batal
										</Button>
										<Button
											type="submit"
											disabled={isLoading}
											className="w-full sm:w-auto h-11 px-7 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.15em] shadow-xl shadow-slate-900/10 hover:bg-emerald-600 flex items-center gap-3"
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
							<div className="bg-emerald-50 px-6 sm:px-8 py-5 border-t border-emerald-100 flex items-center gap-4">
								<div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-xs shrink-0">
									<ShieldCheck size={20} />
								</div>
								<p className="text-[10px] font-bold text-emerald-700/80 leading-relaxed uppercase tracking-widest">
									Seluruh akses staf dipantau oleh sistem audit keamanan Mahira Laundry. Pastikan
									data akun valid.
								</p>
							</div>
						</div>
					</div>,
					document.body,
				)}

			<AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
				<AlertDialogContent className="rounded-[2.5rem] border-slate-100 p-8">
					<AlertDialogHeader>
						<div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 mx-auto sm:mx-0 shadow-inner">
							<Trash2 />
						</div>
						<AlertDialogTitle className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Cabut Akses Staf?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-500 font-medium text-base">
							Akses {staff?.full_name || "staf ini"} akan dicabut dari sistem secara permanen.
							Tindakan ini{" "}
							<span className="text-red-600 font-bold underline decoration-2 underline-offset-4">
								tidak dapat dibatalkan
							</span>
							.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
						<AlertDialogCancel className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-slate-100 hover:bg-slate-50 transition-all">
							Batal
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								handleDelete();
							}}
							disabled={isLoading}
							className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600 shadow-xl shadow-red-100 transition-all"
						>
							{isLoading ? "Menghapus..." : "Ya, Cabut Akses"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
