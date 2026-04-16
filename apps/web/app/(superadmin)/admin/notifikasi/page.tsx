"use client";

import { BellRing, Loader2, Megaphone, Send, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
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
		<div className="space-y-8 pb-20">
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

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="grid grid-cols-1 lg:grid-cols-3 gap-8"
			>
				{/* Form Section */}
				<div className="lg:col-span-2 bg-card border rounded-3xl p-8 shadow-sm">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium">Judul Notifikasi</label>
							<input
								type="text"
								placeholder="Contoh: Promo Ramadhan Berkah ✨"
								className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Isi Pesan</label>
							<textarea
								rows={5}
								placeholder="Tulis pesan lengkap Anda di sini..."
								className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all resize-none"
								value={formData.body}
								onChange={(e) =>
									setFormData({ ...formData, body: e.target.value })
								}
							></textarea>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Tipe</label>
								<select
									className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
									value={formData.type}
									onChange={(e) =>
										setFormData({ ...formData, type: e.target.value as any })
									}
								>
									<option value="promotion">Promosi / Diskon</option>
									<option value="system">Sistem / Informasi</option>
								</select>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Target Pengguna</label>
								<select
									className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
									value={formData.targetRole}
									onChange={(e) =>
										setFormData({ ...formData, targetRole: e.target.value })
									}
								>
									<option value="">Semua Pengguna</option>
									<option value="customer">Pelanggan Saja</option>
									<option value="kasir">Staff Kasir Saja</option>
									<option value="kurir">Kurir Saja</option>
								</select>
							</div>
						</div>

						<button
							disabled={loading}
							className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
						>
							{loading ? (
								<Loader2 className="animate-spin" />
							) : (
								<Send size={20} />
							)}
							Sebarkan Notifikasi Sekarang
						</button>
					</form>
				</div>

				{/* Info Section */}
				<div className="space-y-6">
					<div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6">
						<div className="flex items-center gap-3 mb-4 text-emerald-600 dark:text-emerald-400 font-bold">
							<Megaphone size={20} />
							Tips Promo
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Gunakan emoji dan bahasa yang menarik untuk meningkatkan
							engagement pelanggan Mahira. Notifikasi akan muncul di aplikasi
							dan segera terkirim ke target.
						</p>
					</div>

					<div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6">
						<div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400 font-bold">
							<ShieldAlert size={20} />
							Keamanan
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Pastikan informasi sistem benar sebelum menyebarkannya ke kurir
							atau kasir karena tidak dapat dibatalkan.
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
