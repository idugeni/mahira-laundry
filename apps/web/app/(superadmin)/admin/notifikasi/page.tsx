"use client";

import { BellRing, Loader2, Megaphone, Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { broadcastNotification } from "@/lib/actions/notifications";

export default function AdminNotificationPage() {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		body: "",
		type: "promotion" as "promotion" | "system",
		targetRole: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.title || !formData.body) {
			toast.error("Judul dan pesan wajib diisi");
			return;
		}

		setLoading(true);
		try {
			const res = await broadcastNotification(formData);
			if (res.success) {
				toast.success("Notifikasi berhasil disebarkan!");
				setFormData({ title: "", body: "", type: "promotion", targetRole: "" });
			} else {
				toast.error(res.error || "Gagal menyebarkan notifikasi");
			}
		} catch (_err) {
			toast.error("Terjadi kesalahan sistem");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6 sm:space-y-8 ">
			<div className="flex items-center gap-4">
				<div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
					<BellRing size={32} />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
						Pusat Notifikasi
					</h1>
					<p className="text-muted-foreground">
						Kirim pengumuman dan promo ke seluruh pengguna Mahira.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* Form Section */}
				<div className="lg:col-span-2 bg-card border rounded-2xl p-5 sm:p-8 shadow-xs">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="notif-title" className="text-sm font-medium">
								Judul Notifikasi
							</label>
							<input
								id="notif-title"
								type="text"
								placeholder="Contoh: Promo Ramadhan Berkah ✨"
								className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="notif-body" className="text-sm font-medium">
								Isi Pesan
							</label>
							<textarea
								id="notif-body"
								rows={5}
								placeholder="Tulis pesan lengkap Anda di sini..."
								className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all resize-none"
								value={formData.body}
								onChange={(e) => setFormData({ ...formData, body: e.target.value })}
							></textarea>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="notif-type" className="text-sm font-medium">
									Tipe
								</label>
								<Select
									value={formData.type}
									onValueChange={(value: "promotion" | "system") =>
										setFormData({ ...formData, type: value })
									}
								>
									<SelectTrigger id="notif-type">
										<SelectValue placeholder="Pilih Tipe" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="promotion">Promosi / Diskon</SelectItem>
										<SelectItem value="system">Sistem / Informasi</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<label htmlFor="notif-target" className="text-sm font-medium">
									Target Pengguna
								</label>
								<Select
									value={formData.targetRole}
									onValueChange={(value: string) => setFormData({ ...formData, targetRole: value })}
								>
									<SelectTrigger id="notif-target">
										<SelectValue placeholder="Semua Pengguna" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">Semua Pengguna</SelectItem>
										<SelectItem value="customer">Pelanggan Saja</SelectItem>
										<SelectItem value="kasir">Staff Kasir Saja</SelectItem>
										<SelectItem value="kurir">Kurir Saja</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20 disabled:opacity-50"
						>
							{loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
							Sebarkan Notifikasi Sekarang
						</button>
					</form>
				</div>

				{/* Info Section */}
				<div className="space-y-6">
					<div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
						<div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400 font-bold">
							<Megaphone size={20} />
							Tips Promo
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Gunakan emoji dan bahasa yang menarik untuk meningkatkan engagement pelanggan Mahira.
							Notifikasi akan muncul di aplikasi dan segera terkirim ke target.
						</p>
					</div>

					<div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 sm:p-6">
						<div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400 font-bold">
							<ShieldAlert size={20} />
							Keamanan
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Pastikan informasi sistem benar sebelum menyebarkannya ke kurir atau kasir karena
							tidak dapat dibatalkan.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
