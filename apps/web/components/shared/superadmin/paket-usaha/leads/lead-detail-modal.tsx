"use client";

import {
	ArrowRight,
	Clock,
	ExternalLink,
	Loader2,
	Mail,
	MapPin,
	MessageSquare,
	Package,
	Phone,
	User,
	Wallet,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateInquiryStatus } from "@/lib/actions/business-inquiries";
import { createClient } from "@/lib/supabase/client";
import type {
	BusinessPackageInquiry,
	InquiryLog,
	InquiryStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadDetailModalProps {
	lead: BusinessPackageInquiry;
	onClose: () => void;
}

const STATUS_LABELS: Record<InquiryStatus, string> = {
	new: "Baru",
	contacted: "Dihubungi",
	negotiating: "Negosiasi",
	converted: "Konversi",
	rejected: "Ditolak",
};

const STATUS_COLORS: Record<InquiryStatus, string> = {
	new: "bg-blue-50 text-blue-600",
	contacted: "bg-yellow-50 text-yellow-600",
	negotiating: "bg-orange-50 text-orange-600",
	converted: "bg-emerald-50 text-emerald-600",
	rejected: "bg-rose-50 text-rose-500",
};

const ALL_STATUSES: InquiryStatus[] = [
	"new",
	"contacted",
	"negotiating",
	"converted",
	"rejected",
];

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
	const [currentLead, setCurrentLead] = useState<BusinessPackageInquiry>(lead);
	const [logs, setLogs] = useState<InquiryLog[]>([]);
	const [logsLoading, setLogsLoading] = useState(true);
	const [newStatus, setNewStatus] = useState<InquiryStatus>(lead.status);
	const [note, setNote] = useState("");
	const [updating, setUpdating] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Fetch logs on mount
	useEffect(() => {
		async function fetchLogs() {
			setLogsLoading(true);
			try {
				const supabase = createClient();
				const { data, error } = await supabase
					.from("business_package_inquiry_logs")
					.select("*")
					.eq("inquiry_id", lead.id)
					.order("created_at", { ascending: true });

				if (error) throw error;
				setLogs(data ?? []);
			} catch (err) {
				console.error("Failed to fetch inquiry logs:", err);
			} finally {
				setLogsLoading(false);
			}
		}

		fetchLogs();
	}, [lead.id]);

	async function handleUpdateStatus() {
		if (newStatus === currentLead.status) {
			toast.info("Status tidak berubah.");
			return;
		}
		setUpdating(true);
		try {
			const res = await updateInquiryStatus(
				currentLead.id,
				newStatus,
				note.trim() || undefined,
			);
			if (!res.success) {
				toast.error(res.error ?? "Gagal mengubah status.");
				return;
			}
			// Optimistically update local state
			setCurrentLead((prev) => ({ ...prev, status: newStatus }));
			// Append new log entry optimistically
			setLogs((prev) => [
				...prev,
				{
					id: crypto.randomUUID(),
					inquiry_id: currentLead.id,
					changed_by: "",
					old_status: currentLead.status,
					new_status: newStatus,
					note: note.trim() || null,
					created_at: new Date().toISOString(),
				},
			]);
			setNote("");
			toast.success("Status berhasil diubah.");
		} catch {
			toast.error("Terjadi kesalahan, coba lagi.");
		} finally {
			setUpdating(false);
		}
	}

	const modalContent = (
		<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Tutup modal"
				className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-default"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm rounded-t-[2.5rem] px-8 pt-8 pb-5 border-b border-slate-50 flex items-start justify-between gap-4">
					<div>
						<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
							Detail Lead
						</p>
						<h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
							{currentLead.full_name}
						</h2>
					</div>
					<div className="flex items-center gap-3">
						<Badge
							className={cn(
								"px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border-none shadow-none",
								STATUS_COLORS[currentLead.status],
							)}
						>
							{STATUS_LABELS[currentLead.status]}
						</Badge>
						<button
							type="button"
							onClick={onClose}
							className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
						>
							<X size={16} />
						</button>
					</div>
				</div>

				<div className="px-8 py-6 space-y-8">
					{/* Inquiry Fields */}
					<section>
						<SectionTitle>Informasi Calon Mitra</SectionTitle>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
							<InfoRow
								icon={<User size={14} />}
								label="Nama Lengkap"
								value={currentLead.full_name}
							/>
							<InfoRow
								icon={<Phone size={14} />}
								label="Telepon / WhatsApp"
								value={currentLead.phone}
							/>
							<InfoRow
								icon={<Mail size={14} />}
								label="Email"
								value={currentLead.email}
							/>
							<InfoRow
								icon={<MapPin size={14} />}
								label="Kota"
								value={currentLead.city}
							/>
							<InfoRow
								icon={<Package size={14} />}
								label="Paket Diminati"
								value={currentLead.package_name}
							/>
							<InfoRow
								icon={<Wallet size={14} />}
								label="Modal Disiapkan"
								value={currentLead.budget_range ?? "—"}
							/>
							<InfoRow
								icon={<Clock size={14} />}
								label="Tanggal Inquiry"
								value={new Date(currentLead.created_at).toLocaleDateString(
									"id-ID",
									{
										day: "2-digit",
										month: "long",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									},
								)}
							/>
						</div>
						{currentLead.message && (
							<div className="mt-4 p-4 bg-slate-50 rounded-2xl">
								<div className="flex items-center gap-2 mb-2">
									<MessageSquare size={14} className="text-slate-400" />
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Pesan
									</p>
								</div>
								<p className="text-sm font-bold text-slate-700 leading-relaxed">
									{currentLead.message}
								</p>
							</div>
						)}
					</section>

					{/* Outlet Link */}
					{currentLead.converted_outlet_id && (
						<section>
							<SectionTitle>Outlet Terkait</SectionTitle>
							<div className="mt-4">
								<Link
									href={`/admin/outlet/${currentLead.converted_outlet_id}`}
									className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-colors"
								>
									<ExternalLink size={14} />
									Lihat Detail Outlet
								</Link>
							</div>
						</section>
					)}

					{/* Status History Timeline */}
					<section>
						<SectionTitle>Riwayat Status</SectionTitle>
						<div className="mt-4">
							{logsLoading ? (
								<div className="flex items-center gap-3 py-4 text-slate-400">
									<Loader2 size={16} className="animate-spin" />
									<span className="text-xs font-bold uppercase tracking-widest">
										Memuat riwayat...
									</span>
								</div>
							) : logs.length === 0 ? (
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest py-4">
									Belum ada perubahan status.
								</p>
							) : (
								<div className="space-y-3">
									{logs.map((log, idx) => (
										<div key={log.id} className="flex items-start gap-4">
											{/* Timeline dot + line */}
											<div className="flex flex-col items-center">
												<div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1 shrink-0" />
												{idx < logs.length - 1 && (
													<div className="w-px flex-1 bg-slate-100 mt-1 min-h-[1.5rem]" />
												)}
											</div>
											<div className="pb-3 flex-1">
												<div className="flex items-center gap-2 flex-wrap">
													{log.old_status && (
														<>
															<Badge
																className={cn(
																	"px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-none",
																	STATUS_COLORS[
																		log.old_status as InquiryStatus
																	] ?? "bg-slate-50 text-slate-500",
																)}
															>
																{STATUS_LABELS[
																	log.old_status as InquiryStatus
																] ?? log.old_status}
															</Badge>
															<ArrowRight
																size={10}
																className="text-slate-300"
															/>
														</>
													)}
													<Badge
														className={cn(
															"px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-none",
															STATUS_COLORS[log.new_status as InquiryStatus] ??
																"bg-slate-50 text-slate-500",
														)}
													>
														{STATUS_LABELS[log.new_status as InquiryStatus] ??
															log.new_status}
													</Badge>
												</div>
												{log.note && (
													<p className="text-xs font-bold text-slate-500 mt-1 italic">
														"{log.note}"
													</p>
												)}
												<p className="text-[10px] font-bold text-slate-300 mt-1">
													{new Date(log.created_at).toLocaleDateString(
														"id-ID",
														{
															day: "2-digit",
															month: "short",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</section>

					{/* Status Change */}
					<section>
						<SectionTitle>Ubah Status</SectionTitle>
						<div className="mt-4 space-y-4">
							<div className="space-y-1.5">
								<label
									htmlFor="lead-new-status"
									className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
								>
									Status Baru
								</label>
								<select
									id="lead-new-status"
									value={newStatus}
									onChange={(e) =>
										setNewStatus(e.target.value as InquiryStatus)
									}
									className="w-full h-11 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
								>
									{ALL_STATUSES.map((s) => (
										<option key={s} value={s}>
											{STATUS_LABELS[s]}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-1.5">
								<label
									htmlFor="lead-note"
									className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
								>
									Catatan (opsional)
								</label>
								<textarea
									id="lead-note"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="Tambahkan catatan perubahan status..."
									rows={3}
									className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all resize-none"
								/>
							</div>
							<Button
								onClick={handleUpdateStatus}
								disabled={updating || newStatus === currentLead.status}
								className="bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl px-6 h-11 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
							>
								{updating && <Loader2 size={14} className="animate-spin" />}
								Ubah Status
							</Button>
						</div>
					</section>

					{/* Onboarding Mitra Button */}
					{currentLead.status === "converted" && (
						<section>
							<SectionTitle>Onboarding Mitra</SectionTitle>
							<div className="mt-4">
								<Link
									href={`/admin/franchise?fullName=${encodeURIComponent(currentLead.full_name)}&email=${encodeURIComponent(currentLead.email)}`}
									className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/20"
								>
									<ExternalLink size={14} />
									Onboarding Mitra
								</Link>
								<p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
									Buka halaman franchise dengan data lead terisi otomatis.
								</p>
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);

	if (!mounted) return null;
	return createPortal(modalContent, document.body);
}

// ─── Helper Components ────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
			{children}
		</p>
	);
}

interface InfoRowProps {
	icon: React.ReactNode;
	label: string;
	value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
	return (
		<div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
			<div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
					{label}
				</p>
				<p className="text-sm font-bold text-slate-800 mt-0.5 break-words">
					{value}
				</p>
			</div>
		</div>
	);
}
