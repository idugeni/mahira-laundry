"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { HiOutlineClock } from "react-icons/hi2";

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

interface PromoCountdownProps {
	expiresAt: string;
}

function calculateTimeLeft(expiresAt: string): TimeLeft {
	const diff = new Date(expiresAt).getTime() - Date.now();
	if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

	return {
		days: Math.floor(diff / (1000 * 60 * 60 * 24)),
		hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((diff / (1000 * 60)) % 60),
		seconds: Math.floor((diff / 1000) % 60),
	};
}

export default function PromoCountdown({ expiresAt }: PromoCountdownProps) {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
		calculateTimeLeft(expiresAt),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calculateTimeLeft(expiresAt));
		}, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	const { days, hours, minutes, seconds } = timeLeft;

	if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
		return (
			<div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
				<HiOutlineClock size={12} />
				<span>Promo Berakhir</span>
			</div>
		);
	}

	const TimeUnit = ({ value, label }: { value: number; label: string }) => (
		<div className="flex flex-col items-center">
			<div className="bg-white/50 backdrop-blur-sm border border-brand-primary/10 rounded-xl px-2 py-1.5 min-w-[36px] flex items-center justify-center shadow-sm">
				<span className="text-sm font-black text-brand-primary tabular-nums tracking-tighter">
					{value.toString().padStart(2, "0")}
				</span>
			</div>
			<span className="text-[7px] font-black text-slate-400 mt-1 uppercase tracking-widest">
				{label}
			</span>
		</div>
	);

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="flex items-center gap-2 text-brand-primary/60">
				<span className="animate-pulse">
					<HiOutlineClock size={12} />
				</span>
				<span className="text-[9px] font-black uppercase tracking-[0.2em]">
					Promo Berakhir Dalam:
				</span>
			</div>

			<div className="flex items-center justify-center gap-2">
				<TimeUnit value={days} label="Hari" />
				<span className="text-brand-primary font-black pb-4">:</span>
				<TimeUnit value={hours} label="Jam" />
				<span className="text-brand-primary font-black pb-4">:</span>
				<TimeUnit value={minutes} label="Mnt" />
				<span className="text-brand-primary font-black pb-4">:</span>
				<TimeUnit value={seconds} label="Dtk" />
			</div>
		</div>
	);
}
