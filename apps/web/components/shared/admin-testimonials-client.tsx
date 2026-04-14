"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import {
	HiCheck,
	HiOutlineChatBubbleLeftRight,
	HiOutlineTrash,
	HiStar,
	HiXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import {
	deleteTestimonial,
	updateTestimonialStatus,
} from "@/lib/actions/testimonial";

interface Testimonial {
	id: string;
	content: string;
	rating: number;
	is_published: boolean;
	created_at: string;
	profiles: {
		full_name: string;
	};
}

interface AdminTestimonialsClientProps {
	testimonials: Testimonial[];
}

export function AdminTestimonialsClient({
	testimonials,
}: AdminTestimonialsClientProps) {
	const [loading, setLoading] = useState<string | null>(null);

	async function handleToggleStatus(
		testimonialId: string,
		currentStatus: boolean,
	) {
		setLoading(testimonialId);
		try {
			const res = await updateTestimonialStatus(testimonialId, !currentStatus);
			if (res.error) toast.error(res.error);
			else
				toast.success(
					!currentStatus
						? "Testimoni dipublikasikan!"
						: "Testimoni disembunyikan!",
				);
		} catch (_err) {
			toast.error("Gagal memperbarui status.");
		} finally {
			setLoading(null);
		}
	}

	async function handleDelete(testimonialId: string) {
		if (!confirm("Hapus testimoni ini secara permanen?")) return;
		setLoading(testimonialId);
		try {
			const res = await deleteTestimonial(testimonialId);
			if (res.error) toast.error(res.error);
			else toast.success("Testimoni dihapus.");
		} catch (_err) {
			toast.error("Gagal menghapus.");
		} finally {
			setLoading(null);
		}
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-black text-slate-900 flex items-center gap-4">
					<span className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
						<HiOutlineChatBubbleLeftRight />
					</span>
					Moderasi Testimoni
				</h1>
				<p className="text-slate-500 mt-2 font-medium">
					Kelola ulasan pelanggan yang tampil di halaman depan.
				</p>
			</div>

			<div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/50 border-b border-slate-100">
								<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
									Pelanggan
								</th>
								<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
									Rating & Ulasan
								</th>
								<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
									Status
								</th>
								<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{testimonials.map((t) => (
								<tr
									key={t.id}
									className="group hover:bg-slate-50/30 transition-colors"
								>
									<td className="px-8 py-6">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
												{t.profiles?.full_name?.charAt(0)}
											</div>
											<div>
												<p className="font-bold text-slate-900">
													{t.profiles?.full_name}
												</p>
												<p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
													{format(new Date(t.created_at), "dd MMM yyyy", {
														locale: id,
													})}
												</p>
											</div>
										</div>
									</td>
									<td className="px-8 py-6 max-w-md">
										<div className="flex gap-1 mb-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<span
													key={star}
													className={
														star <= t.rating
															? "text-amber-400"
															: "text-slate-200"
													}
												>
													<HiStar size={16} />
												</span>
											))}
										</div>
										<p className="text-sm text-slate-600 leading-relaxed italic line-clamp-2 hover:line-clamp-none transition-all">
											"{t.content}"
										</p>
									</td>
									<td className="px-8 py-6">
										{t.is_published ? (
											<span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
												Published
											</span>
										) : (
											<span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
												Pending
											</span>
										)}
									</td>
									<td className="px-8 py-6 text-right">
										<div className="flex items-center justify-end gap-2">
											<button
												onClick={() => handleToggleStatus(t.id, t.is_published)}
												disabled={loading === t.id}
												className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
													t.is_published
														? "bg-amber-50 text-amber-600 hover:bg-amber-100"
														: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
												}`}
												title={t.is_published ? "Sembunyikan" : "Setujui"}
											>
												{t.is_published ? <HiXMark /> : <HiCheck />}
											</button>
											<button
												onClick={() => handleDelete(t.id)}
												disabled={loading === t.id}
												className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl hover:bg-red-100 transition-all"
												title="Hapus"
											>
												<HiOutlineTrash />
											</button>
										</div>
									</td>
								</tr>
							))}
							{testimonials.length === 0 && (
								<tr>
									<td
										colSpan={4}
										className="px-8 py-20 text-center text-slate-400 font-medium"
									>
										Belum ada testimoni untuk dimoderasi.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
