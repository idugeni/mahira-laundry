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
		card: "bg-white border-slate-200/80",
		icon: "bg-slate-100 text-slate-600",
		value: "text-slate-900",
		glow: "bg-slate-100",
	},
	primary: {
		card: "bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-200/60",
		icon: "bg-pink-100 text-pink-600",
		value: "text-pink-600",
		glow: "bg-pink-200",
	},
	success: {
		card: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/60",
		icon: "bg-emerald-100 text-emerald-600",
		value: "text-emerald-600",
		glow: "bg-emerald-200",
	},
	warning: {
		card: "bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/60",
		icon: "bg-amber-100 text-amber-600",
		value: "text-amber-600",
		glow: "bg-amber-200",
	},
	danger: {
		card: "bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/60",
		icon: "bg-red-100 text-red-600",
		value: "text-red-600",
		glow: "bg-red-200",
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
				"relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
				styles.card,
				className,
			)}
		>
			{/* Background glow */}
			<div
				className={cn(
					"absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl opacity-30",
					styles.glow,
				)}
			/>

			<div className="relative flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
						{title}
					</p>
					<p className={cn("text-3xl font-black truncate", styles.value)}>
						{value}
					</p>
					{subtitle && (
						<p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
					)}
					{trend && (
						<div className="flex items-center gap-1 mt-2">
							<span
								className={cn(
									"text-xs font-bold px-1.5 py-0.5 rounded-full",
									trend.positive
										? "bg-emerald-100 text-emerald-700"
										: "bg-red-100 text-red-700",
								)}
							>
								{trend.positive ? "▲" : "▼"} {trend.value}
							</span>
							{trend.label && (
								<span className="text-xs text-slate-400">{trend.label}</span>
							)}
						</div>
					)}
				</div>
				{icon && (
					<div
						className={cn(
							"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl",
							styles.icon,
						)}
					>
						{icon}
					</div>
				)}
			</div>
		</div>
	);
}
