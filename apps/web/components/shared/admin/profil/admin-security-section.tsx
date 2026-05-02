"use client";

import { Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendPasswordReset, updatePassword, updateRecoveryEmail } from "@/lib/actions/profile";

interface AdminSecuritySectionProps {
	email: string;
}

export function AdminSecuritySection({ email }: AdminSecuritySectionProps) {
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [passwords, setPasswords] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);

	const [showEmailForm, setShowEmailForm] = useState(false);
	const [newEmail, setNewEmail] = useState("");
	const [emailLoading, setEmailLoading] = useState(false);

	const [resetLoading, setResetLoading] = useState(false);

	const isPasswordValid =
		passwords.newPassword.length >= 6 && passwords.confirmPassword === passwords.newPassword;

	const handlePasswordChange = async () => {
		if (!isPasswordValid) return;
		setPasswordLoading(true);
		try {
			const result = await updatePassword(passwords.newPassword);
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success("Password berhasil diperbarui.");
				setShowPasswordForm(false);
				setPasswords({ newPassword: "", confirmPassword: "" });
			}
		} catch {
			toast.error("Gagal memperbarui password.");
		} finally {
			setPasswordLoading(false);
		}
	};

	const handlePasswordReset = async () => {
		setResetLoading(true);
		try {
			const result = await sendPasswordReset();
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success("Link reset password telah dikirim ke email Anda.");
			}
		} catch {
			toast.error("Gagal mengirim link reset password.");
		} finally {
			setResetLoading(false);
		}
	};

	const handleUpdateEmail = async () => {
		if (!newEmail.includes("@")) {
			toast.error("Format email tidak valid.");
			return;
		}
		setEmailLoading(true);
		try {
			const result = await updateRecoveryEmail(newEmail);
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success("Recovery email berhasil diperbarui.");
				setShowEmailForm(false);
				setNewEmail("");
			}
		} catch {
			toast.error("Gagal memperbarui recovery email.");
		} finally {
			setEmailLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/35 space-y-6">
			<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
				<Lock className="text-indigo-600" size={28} /> Keamanan
			</h2>
			<div className="space-y-4">
				{/* Password Section */}
				<div className="p-5 sm:p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
					<div className="space-y-1">
						<h4 className="font-black text-slate-900 uppercase tracking-tight text-sm flex items-center gap-2">
							<KeyRound size={16} className="text-indigo-600" /> Password
						</h4>
						<p className="text-xs text-slate-500 font-bold leading-relaxed">
							Ubah password langsung atau kirim link reset ke email Anda.
						</p>
					</div>

					{showPasswordForm ? (
						<div className="space-y-3">
							<div className="relative group">
								<KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<Input
									type={showNewPassword ? "text" : "password"}
									placeholder="Password baru (min. 6 karakter)"
									value={passwords.newPassword}
									onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
									className="pl-11 pr-11 h-11 bg-white border-slate-200 rounded-xl font-bold text-sm focus:bg-white transition-all shadow-none"
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
								>
									{showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
							<div className="relative group">
								<KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<Input
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Konfirmasi password baru"
									value={passwords.confirmPassword}
									onChange={(e) =>
										setPasswords({
											...passwords,
											confirmPassword: e.target.value,
										})
									}
									className={`pl-11 pr-11 h-11 bg-white rounded-xl font-bold text-sm focus:bg-white transition-all shadow-none ${
										passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword
											? "border-red-300 focus:border-red-400"
											: "border-slate-200 focus:border-indigo-600"
									}`}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
								>
									{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
							{passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword && (
								<p className="text-[9px] text-red-500 font-black uppercase tracking-widest ml-1">
									Password tidak cocok.
								</p>
							)}
							<div className="flex gap-3">
								<Button
									onClick={() => {
										setShowPasswordForm(false);
										setPasswords({ newPassword: "", confirmPassword: "" });
									}}
									variant="ghost"
									className="flex-1 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-700"
								>
									Batal
								</Button>
								<Button
									onClick={handlePasswordChange}
									disabled={passwordLoading || !isPasswordValid}
									className="flex-1 rounded-xl h-11 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/10 disabled:opacity-50"
								>
									{passwordLoading ? "Menyimpan..." : "Simpan Password"}
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col sm:flex-row gap-3">
							<Button
								onClick={() => setShowPasswordForm(true)}
								className="flex-1 rounded-xl h-11 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10"
							>
								Ganti Password
							</Button>
							<Button
								onClick={handlePasswordReset}
								disabled={resetLoading}
								variant="outline"
								className="flex-1 rounded-xl h-11 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-500 disabled:opacity-50"
							>
								{resetLoading ? "Mengirim..." : "Kirim Link Reset"}
							</Button>
						</div>
					)}
				</div>

				{/* Recovery Email Section */}
				<div className="p-5 sm:p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
					<div className="space-y-1">
						<h4 className="font-black text-slate-900 uppercase tracking-tight text-sm flex items-center gap-2">
							<Mail size={16} className="text-indigo-600" /> Recovery Email
						</h4>
						<p className="text-xs text-slate-500 font-bold leading-relaxed">
							Email pemulihan saat ini: <span className="text-slate-700">{email}</span>
						</p>
					</div>

					{showEmailForm ? (
						<div className="space-y-3">
							<div className="relative group">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
								<Input
									type="email"
									placeholder="email@contoh.com"
									value={newEmail}
									onChange={(e) => setNewEmail(e.target.value)}
									className="pl-11 pr-4 h-11 bg-white border-slate-200 rounded-xl font-bold text-sm focus:bg-white transition-all shadow-none"
								/>
							</div>
							<div className="flex gap-3">
								<Button
									onClick={() => {
										setShowEmailForm(false);
										setNewEmail("");
									}}
									variant="ghost"
									className="flex-1 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-700"
								>
									Batal
								</Button>
								<Button
									onClick={handleUpdateEmail}
									disabled={emailLoading || !newEmail.includes("@")}
									className="flex-1 rounded-xl h-11 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/10 disabled:opacity-50"
								>
									{emailLoading ? "Menyimpan..." : "Simpan"}
								</Button>
							</div>
						</div>
					) : (
						<Button
							onClick={() => setShowEmailForm(true)}
							variant="outline"
							className="w-full rounded-xl h-11 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-500"
						>
							Update Recovery Email
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
