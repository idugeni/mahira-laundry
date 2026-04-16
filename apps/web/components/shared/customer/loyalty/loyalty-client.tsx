"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "motion/react";
import { useState } from "react";
import {
	HiOutlineBolt,
	HiOutlineClipboardDocumentCheck,
	HiOutlineGift,
	HiOutlineShare,
	HiOutlineTrophy,
} from "react-icons/hi2";
import { toast } from "sonner";
import { redeemRewardAction } from "@/lib/actions/loyalty";

interface LoyaltyHistory {
	id: string;
	points: number;
	type: string;
	description: string;
	balance_after: number;
	created_at: string;
	orders?: {
		order_number: string;
	} | null;
}

interface Profile {
	full_name: string;
	loyalty_tier: string;
	loyalty_points: number;
	referral_code: string | null;
	created_at: string;
}

interface Reward {
	id: string;
	name: string;
	description: string;
	points_cost: number;
}

interface LoyaltyClientProps {
	profile: Profile;
	history: LoyaltyHistory[];
	rewards: Reward[];
}

export function LoyaltyClient({
	profile,
	history,
	rewards,
}: LoyaltyClientProps) {
	const [loading, setLoading] = useState<string | null>(null);
	const nextTierPoints =
		profile.loyalty_tier === "bronze"
			? 1000
			: profile.loyalty_tier === "silver"
				? 5000
				: profile.loyalty_tier === "gold"
					? 10000
					: 0;
	const progress =
		nextTierPoints > 0 ? (profile.loyalty_points / nextTierPoints) * 100 : 100;
	const remainingPoints =
		nextTierPoints > profile.loyalty_points
			? nextTierPoints - profile.loyalty_points
			: 0;

	const handleRedeem = async (rewardId: string) => {
		if (loading) return;
		setLoading(rewardId);
		try {
			const res = await redeemRewardAction(rewardId);
			if (res.error) {
				toast.error(res.error);
			} else {
				toast.success("Penukaran berhasil! Hadiah Anda sedang diproses.");
			}
		} catch (_err) {
			toast.error("Terjadi kesalahan sistem.");
		} finally {
			setLoading(null);
		}
	};

	return (
		<div className="space-y-12 pb-20">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<h1 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
						Sultan <span className="text-brand-gradient">Loyalty</span>
					</h1>
					<p className="text-slate-500 mt-3 font-medium text-lg">
						Akses eksklusif, hadiah mewah, dan layanan prioritas Mahira.
					</p>
				</div>
				<div className="p-1 px-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-200">
						<HiOutlineTrophy />
					</div>
					<span className="text-sm font-black text-amber-700 uppercase tracking-widest">
						VIP Member
					</span>
				</div>
			</div>

			{/* Tier & Points Card - Main Hero */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-slate-900 rounded-[3rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden group"
			>
				<div className="absolute top-0 right-0 p-12 text-[200px] text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
					<HiOutlineBolt />
				</div>

				<div className="relative z-10">
					<div className="grid lg:grid-cols-[1fr_300px] gap-12 items-center">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full mb-8">
								<span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
								<span className="text-[10px] font-black uppercase tracking-[3px] text-brand-accent">
									{profile.loyalty_tier} STATUS
								</span>
							</div>
							<h2 className="text-4xl sm:text-6xl font-black font-[family-name:var(--font-heading)] mb-4 tracking-tight">
								{profile.full_name}
							</h2>
							<p className="text-white/40 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
								Mahira Elite Club since{" "}
								{format(new Date(profile.created_at), "yyyy")}
							</p>

							{nextTierPoints > 0 && (
								<div className="mt-12 max-w-md">
									<div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
										<span className="text-white/40">Loyalty Progress</span>
										<span className="text-brand-accent">
											{remainingPoints} Points to{" "}
											{profile.loyalty_tier === "bronze" ? "Silver" : "Gold"}
										</span>
									</div>
									<div className="w-full bg-white/5 rounded-full h-2">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${Math.min(progress, 100)}%` }}
											transition={{ duration: 2, ease: "easeOut" }}
											className="bg-brand-gradient h-full rounded-full shadow-[0_0_15px_rgba(255,184,0,0.4)]"
										/>
									</div>
								</div>
							)}
						</div>

						<div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] text-center">
							<span className="text-[10px] font-black uppercase tracking-[4px] text-white/30 block mb-2">
								Sultan Balance
							</span>
							<div className="text-6xl sm:text-7xl font-black font-[family-name:var(--font-heading)] text-brand-accent drop-shadow-[0_0_20px_rgba(255,184,0,0.4)]">
								{profile.loyalty_points.toLocaleString()}
							</div>
							<span className="text-[10px] font-black uppercase tracking-[2px] text-white/20 block mt-4 italic">
								Exclusive Points
							</span>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Referral Section - Full Width Redesign */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				className="relative group h-full"
			>
				<div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-5 rounded-[2.5rem] blur-3xl transition-opacity duration-1000" />
				<div className="relative bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-sm overflow-hidden min-h-[280px] flex flex-col md:flex-row items-center gap-10">
					<div className="absolute top-0 right-0 p-12 text-[150px] text-slate-50 pointer-events-none group-hover:scale-110 transition-transform duration-1000 -mr-10 -mt-10">
						<HiOutlineShare />
					</div>

					<div className="flex-1 relative z-10">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 italic">
							Get Extra Points
						</div>
						<h2 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 mb-4">
							Sultan <span className="text-blue-600">Referral</span>
						</h2>
						<p className="text-slate-500 font-medium max-w-md leading-relaxed">
							Ajak teman Sultan Anda bergabung. Dapatkan{" "}
							<span className="text-slate-900 font-black">
								25 poin eksklusif
							</span>{" "}
							setiap kali kerabat Anda menyelesaikan pesanan pertama mereka.
						</p>
					</div>

					<div className="w-full md:w-[380px] relative z-10">
						<div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 group-hover:border-blue-200 transition-colors">
							<div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">
								Your Invitation Code
							</div>
							<div className="flex items-center gap-3">
								<div className="flex-1 bg-white px-6 py-4 rounded-2xl font-mono text-2xl font-black tracking-[4px] text-center text-slate-800 shadow-sm border border-slate-100">
									{profile.referral_code || "MHR-UNSET"}
								</div>
								<button
									type="button"
									onClick={() => {
										const url = `${window.location.origin}/register?ref=${profile.referral_code}`;
										navigator.clipboard.writeText(url);
										toast.success("Link Referral Berhasil Disalin!");
									}}
									className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-90"
								>
									<HiOutlineShare />
								</button>
							</div>
							<p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-tighter italic">
								Copy link and send to your VIP group
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Rewards Catalog - Grid Layout Redesign */}
			<section>
				<div className="flex items-center justify-between mb-10 px-4">
					<div>
						<h2 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Katalog Hadiah <span className="text-brand-gradient">Sultan</span>
						</h2>
						<p className="text-slate-400 text-sm font-medium mt-1">
							Pukarkan poin Anda dengan reward eksklusif Mahira.
						</p>
					</div>
					<div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center text-xl">
						<HiOutlineGift />
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{rewards.map((r, i) => (
						<motion.div
							key={r.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1 }}
							className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 transition-all group relative overflow-hidden flex flex-col justify-between"
						>
							{/* Background Decoration Icon */}
							<div className="absolute top-0 right-0 p-4 text-8xl text-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 z-0">
								<HiOutlineGift />
							</div>

							<div className="relative z-10 h-full flex flex-col justify-between">
								<div>
									<div className="flex justify-between items-start mb-6">
										<span className="text-[10px] font-black px-4 py-2 bg-slate-50 text-slate-400 rounded-full uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
											Exclusive Reward
										</span>
										<div className="text-lg font-black text-emerald-600 font-[family-name:var(--font-heading)] flex items-center gap-1">
											{r.points_cost}{" "}
											<span className="text-[10px] uppercase font-black opacity-40">
												Pts
											</span>
										</div>
									</div>
									<h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
										{r.name}
									</h3>
									<p className="text-sm text-slate-500 font-medium leading-relaxed italic">
										{r.description}
									</p>
								</div>

								<button
									type="button"
									onClick={() => handleRedeem(r.id)}
									disabled={profile.loyalty_points < r.points_cost || !!loading}
									className="w-full mt-10 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-[3px] transition-all hover:bg-emerald-500 shadow-xl shadow-slate-100 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none active:scale-95"
								>
									{loading === r.id
										? "Processing..."
										: profile.loyalty_points < r.points_cost
											? "Points Needed"
											: "Redeem Reward"}
								</button>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* History - More Compact & Clean */}
			<div className="bg-white rounded-[3rem] border border-slate-100 p-8 sm:p-12 shadow-sm">
				<div className="flex items-center gap-4 mb-10 px-2">
					<div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl shadow-lg shadow-slate-200">
						<HiOutlineClipboardDocumentCheck />
					</div>
					<div>
						<h2 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Riwayat{" "}
							<span className="text-slate-400 font-medium">Sultan Points</span>
						</h2>
					</div>
				</div>

				{history.length > 0 ? (
					<div className="grid gap-2">
						{history.map((item) => (
							<div
								key={item.id}
								className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-all rounded-[2rem] border border-transparent hover:border-slate-100 group gap-4"
							>
								<div className="flex items-center gap-6">
									<div
										className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-transform group-hover:scale-110 shrink-0 ${item.points > 0 ? "bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100" : "bg-red-50 text-red-600"}`}
									>
										{item.points > 0 ? "+" : ""}
										{item.points}
									</div>
									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-black text-slate-900 leading-tight uppercase tracking-tight truncate max-w-[200px] sm:max-w-md">
												{item.description}
											</p>
											{item.orders?.order_number && (
												<span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">
													#{item.orders.order_number}
												</span>
											)}
										</div>
										<div className="flex items-center gap-3 mt-1.5">
											<span className="text-[10px] font-black px-2 py-0.5 bg-white border border-slate-100 rounded text-slate-400 uppercase tracking-tighter">
												{item.type}
											</span>
											<p className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic leading-none pt-0.5">
												{format(
													new Date(item.created_at),
													"dd MMM yyyy • HH:mm",
													{ locale: id },
												)}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-4 pl-20 sm:pl-0">
									<div className="text-right">
										<p className="text-[9px] font-black text-slate-300 uppercase tracking-[2px] leading-none mb-1">
											Saldo Akhir
										</p>
										<p className="text-lg font-black text-slate-900 font-[family-name:var(--font-heading)] leading-none">
											{item.balance_after}{" "}
											<span className="text-[9px] text-slate-400">Pts</span>
										</p>
									</div>
									<div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-200 group-hover:text-brand-primary transition-colors">
										<HiOutlineBolt />
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-24 bg-slate-50/30 rounded-[2.5rem] border-2 border-dashed border-slate-100">
						<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-slate-200">
							<span className="text-slate-100 text-4xl flex items-center justify-center">
								<HiOutlineBolt />
							</span>
						</div>
						<p className="font-black text-slate-400 text-lg uppercase tracking-tight">
							Belum ada aktivitas poin
						</p>
						<p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-widest italic leading-relaxed">
							Mulai pesanan Anda dan kumpulkan Poin Sultan!
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
