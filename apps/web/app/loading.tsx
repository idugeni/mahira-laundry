import { MahiraLogo } from "@/components/brand/mahira-logo";

export default function GlobalLoading() {
	return (
		<div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-500">
			<div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
				{/* Circular logo with spinning ring (Exactly like Splash Screen) */}
				<div className="relative w-28 h-28 flex items-center justify-center">
					{/* Spinning ring */}
					<div
						className="absolute inset-0 rounded-full animate-spin"
						style={{ animationDuration: "1.5s" }}
					>
						<svg viewBox="0 0 112 112" className="w-full h-full" fill="none" aria-hidden="true">
							<circle cx="56" cy="56" r="54" stroke="rgb(241 245 249)" strokeWidth="3" />
							<circle
								cx="56"
								cy="56"
								r="54"
								stroke="url(#splash-gradient)"
								strokeWidth="3"
								strokeLinecap="round"
								strokeDasharray="84 255"
							/>
							<defs>
								<linearGradient id="splash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="rgb(219 39 119)" />
									<stop offset="100%" stopColor="rgb(251 113 133)" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					{/* Logo inside circle */}
					<div className="w-20 h-20 rounded-full bg-slate-50/80 backdrop-blur-xs flex items-center justify-center shadow-xs border border-slate-100/80">
						<MahiraLogo size={48} showText={false} />
					</div>
				</div>

				<div className="flex flex-col items-center gap-2">
					<span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 animate-pulse">
						Mahira Laundry
					</span>
				</div>
			</div>
		</div>
	);
}
