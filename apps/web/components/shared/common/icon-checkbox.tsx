"use client";

interface IconCheckboxProps {
	name: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	icon: string;
	label: string;
	activeColor: string; // e.g. "amber" → border-amber-500 bg-amber-500
}

const colorMap: Record<string, { border: string; bg: string; hover: string }> = {
	amber: {
		border: "border-amber-500",
		bg: "bg-amber-500",
		hover: "group-hover/check:border-amber-200",
	},
	brand: {
		border: "border-brand-primary",
		bg: "bg-brand-primary",
		hover: "group-hover/check:border-brand-primary/40",
	},
	emerald: {
		border: "border-emerald-500",
		bg: "bg-emerald-500",
		hover: "group-hover/check:border-emerald-200",
	},
	rose: {
		border: "border-rose-500",
		bg: "bg-rose-500",
		hover: "group-hover/check:border-rose-200",
	},
};

export function IconCheckbox({
	name,
	checked,
	onChange,
	icon,
	label,
	activeColor,
}: IconCheckboxProps) {
	const colors = colorMap[activeColor] ?? colorMap["brand"]!;

	return (
		<label className="flex items-center gap-3 cursor-pointer group/check shrink-0">
			<input
				type="checkbox"
				name={name}
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="hidden"
			/>
			<div
				className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all ${checked ? `${colors.border} ${colors.bg}` : `border-slate-200 bg-white ${colors.hover}`}`}
			>
				{checked && (
					<span className="absolute text-white pointer-events-none text-[10px] animate-fade-in">
						{icon}
					</span>
				)}
			</div>
			<span className="text-xs font-black text-slate-600 group-hover/check:text-slate-900 transition-colors uppercase tracking-widest">
				{label}
			</span>
		</label>
	);
}
