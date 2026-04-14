"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	Calendar,
	CheckCircle2,
	MessageSquare,
	MoreVertical,
	Quote,
	Star,
	Trash2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import {
	HiCheck,
	HiOutlineChatBubbleLeftRight,
	HiOutlineTrash,
	HiStar,
	HiXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import { PaginationControls } from "@/components/shared/common/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	deleteTestimonial,
	updateTestimonialStatus,
} from "@/lib/actions/testimonial";
import { cn } from "@/lib/utils";

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
	const [currentPage, setCurrentPage] = useState(1);

	const ITEMS_PER_PAGE = 9;
	const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
	const paginatedTestimonials = testimonials.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

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
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-amber-50 text-amber-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Kualitas Layanan
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<MessageSquare size={14} /> {testimonials.length} Ulasan Total
							</span>
						</div>
						<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
							Moderasi <span className="text-indigo-600 italic">Testimoni</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Kurasi ulasan pelanggan terbaik untuk ditampilkan pada etalase
							digital Mahira Laundry. Pastikan standar kepuasan tetap terjaga.
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex flex-col items-end">
							<p className="text-2xl font-black text-slate-900">
								{testimonials.filter((t) => t.is_published).length}
							</p>
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								Published
							</p>
						</div>
						<div className="w-px h-10 bg-slate-100 mx-2" />
						<div className="flex flex-col items-start">
							<p className="text-2xl font-black text-amber-500">
								{testimonials.filter((t) => !t.is_published).length}
							</p>
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								Pending
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials Grid */}
			{testimonials.length === 0 ? (
				<div className="bg-white rounded-[4rem] border border-slate-100 p-24 text-center shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
					<div className="relative flex flex-col items-center">
						<div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-100">
							<MessageSquare size={48} className="text-slate-200" />
						</div>
						<h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
							Belum Ada Suara
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed text-center mx-auto">
							Kotak saran digital Mahira Laundry masih kosong. Mari kita
							kumpulkan ulasan dari pelanggan setia.
						</p>
					</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{paginatedTestimonials.map((t) => (
							<div
								key={t.id}
								className="group relative bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col gap-6 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
							>
								<div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors pointer-events-none">
									<Quote size={80} strokeWidth={4} />
								</div>

								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl border-2 border-white shadow-lg transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
											{t.profiles?.full_name?.charAt(0)}
										</div>
										<div className="min-w-0">
											<p className="font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">
												{t.profiles?.full_name}
											</p>
											<div className="flex items-center gap-1.5 mt-1">
												<Calendar size={12} className="text-slate-400" />
												<p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
													{format(new Date(t.created_at), "dd MMM yyyy", {
														locale: id,
													})}
												</p>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											className={cn(
												"w-12 h-12 p-0 rounded-2xl transition-all active:scale-90 shadow-sm",
												t.is_published
													? "bg-amber-50 text-amber-500 hover:bg-amber-100"
													: "bg-emerald-50 text-emerald-500 hover:bg-emerald-100",
											)}
											onClick={() => handleToggleStatus(t.id, t.is_published)}
											disabled={loading === t.id}
										>
											{t.is_published ? (
												<XCircle size={24} />
											) : (
												<CheckCircle2 size={24} />
											)}
										</Button>
										<Button
											variant="ghost"
											className="w-12 h-12 p-0 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all active:scale-90 shadow-sm"
											onClick={() => handleDelete(t.id)}
											disabled={loading === t.id}
										>
											<Trash2 size={24} />
										</Button>
									</div>
								</div>

								<div className="relative flex-1">
									<div className="flex gap-1 mb-4">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												size={20}
												className={cn(
													"transition-all duration-500 group-hover:scale-110",
													star <= t.rating
														? "text-amber-400 fill-amber-400"
														: "text-slate-100 fill-slate-100",
												)}
											/>
										))}
									</div>
									<p className="text-slate-600 font-bold text-sm leading-relaxed italic relative z-10">
										"{t.content}"
									</p>
								</div>

								<div className="relative pt-6 border-t border-slate-50 flex items-center justify-between">
									<Badge
										className={cn(
											"px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-none shadow-none",
											t.is_published
												? "bg-emerald-50 text-emerald-600"
												: "bg-slate-100 text-slate-400",
										)}
									>
										{t.is_published ? "● Published" : "○ Pelatihan"}
									</Badge>

									<div className="flex items-center gap-1">
										<p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
											Global Review
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						totalItems={testimonials.length}
						itemsPerPage={ITEMS_PER_PAGE}
					/>
				</>
			)}

			{/* Moderation Guide */}
			<div className="bg-slate-900 rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

				<div className="relative flex flex-col lg:flex-row items-center gap-10">
					<div className="w-24 h-24 bg-white/10 rounded-[2rem] border border-white/10 flex items-center justify-center text-4xl shadow-2xl backdrop-blur-xl">
						📋
					</div>
					<div className="flex-1 text-center lg:text-left">
						<h3 className="text-2xl font-black uppercase tracking-tight mb-4">
							Kebijakan Moderasi
						</h3>
						<p className="text-slate-400 font-bold text-sm leading-relaxed max-w-2xl">
							Kami mengedepankan transparansi. Testimoni yang mengandung konten
							negatif berlebihan harus tetap dimoderasi dengan bijak.
							Publikasikan ulasan yang membangun reputasi Mahira Laundry secara
							objektif.
						</p>
					</div>
					<div className="flex gap-4">
						<Button
							variant="outline"
							className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-white/20 bg-white/5 hover:bg-white hover:text-slate-900 transition-all"
						>
							Pelajari SOP
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
