import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon?: ReactNode;
	trend?: {
		value: string;
		positive: boolean;
		label?: string;
	};
	variant?: "default" | "primary" | "success" | "warning" | "danger";
	className?: string;
}

const variantStyles = {
	default: {
		card: "bg-white border-slate-200/80 hover:border-slate-300",
		icon: "bg-slate-50 text-slate-600 border-slate-200/50",
		value: "text-slate-900",
		glow: "bg-slate-400",
		accent: "bg-slate-900",
	},
	primary: {
		card: "bg-white border-indigo-100 hover:border-indigo-200",
		icon: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
		value: "text-indigo-600",
		glow: "bg-indigo-400",
		accent: "bg-indigo-600",
	},
	success: {
		card: "bg-white border-emerald-100 hover:border-emerald-200",
		icon: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
		value: "text-emerald-600",
		glow: "bg-emerald-400",
		accent: "bg-emerald-600",
	},
	warning: {
		card: "bg-white border-amber-100 hover:border-amber-200",
		icon: "bg-amber-50 text-amber-600 border-amber-100/50",
		value: "text-amber-600",
		glow: "bg-amber-400",
		accent: "bg-amber-600",
	},
	danger: {
		card: "bg-white border-rose-100 hover:border-rose-200",
		icon: "bg-rose-50 text-rose-600 border-rose-100/50",
		value: "text-rose-600",
		glow: "bg-rose-400",
		accent: "bg-rose-600",
	},
};

export function StatCard({
	title,
	value,
	subtitle,
	icon,
	trend,
	variant = "default",
	className,
}: StatCardProps) {
	const styles = variantStyles[variant];

	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-6 shadow-xs will-change-transform backface-hidden transition-[border-color,transform,opacity] duration-300 ease-out hover:-translate-y-1",
				styles.card,
				className,
			)}
		>
			{/* Decorative Elements */}
			<div
				className={cn(
					"absolute -right-4 -top-4 h-32 w-32 rounded-full blur-[40px] opacity-[0.08] will-change-[opacity] transition-opacity duration-500 ease-out group-hover:opacity-[0.12]",
					styles.glow,
				)}
			/>

			{/* Left Accent Bar */}
			<div
				className={cn(
					"absolute left-0 top-0 bottom-0 w-1.5 opacity-0 will-change-[opacity] group-hover:opacity-100 transition-opacity duration-300 ease-out",
					styles.accent,
				)}
			/>

			<div className="relative flex flex-col gap-3 sm:gap-6">
				<div className="flex items-center justify-between gap-2">
					<div
						className={cn(
							"flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border text-lg shadow-inner-sm will-change-transform transition-transform duration-300 ease-out group-hover:-translate-y-1",
							styles.icon,
						)}
					>
						{icon}
					</div>

					{trend && (
						<div
							className={cn(
								"flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0",
								trend.positive
									? "bg-emerald-50 text-emerald-600"
									: "bg-rose-50 text-rose-600",
							)}
						>
							{trend.positive ? "↑" : "↓"} {trend.value}
						</div>
					)}
				</div>

				<div className="flex-1 min-w-0">
					<p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1 sm:mb-2 truncate">
						{title}
					</p>
					<div className="flex items-baseline gap-2">
						<p
							className={cn(
								"text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-heading)] truncate",
								styles.value,
							)}
						>
							{value}
						</p>
					</div>
					{(subtitle || trend?.label) && (
						<p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-1 sm:mt-3 flex items-center gap-2 uppercase tracking-widest truncate">
							{subtitle || trend?.label}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
