import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Manajemen Shift",
	description: "Kelola shift kerja kasir di Mahira Laundry.",
};

export default function ShiftPage() {
	const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
				Jadwal Shift
			</h1>
			<div className="bg-white rounded-xl border border-border p-6">
				<div className="grid grid-cols-7 gap-2 mb-4">
					{days.map((day) => (
						<div
							key={day}
							className="text-center text-sm font-medium text-muted-foreground"
						>
							{day}
						</div>
					))}
					{Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
						<div
							key={day}
							className="aspect-square rounded-lg border border-border flex items-center justify-center text-sm hover:bg-muted cursor-pointer transition-colors"
						>
							{day}
						</div>
					))}
				</div>
				<div className="flex gap-4 mt-4 pt-4 border-t border-border">
					<button
						type="button"
						className="flex-1 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold"
					>
						🟢 Clock In
					</button>
					<button
						type="button"
						className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground"
					>
						🔴 Clock Out
					</button>
				</div>
			</div>
		</div>
	);
}
