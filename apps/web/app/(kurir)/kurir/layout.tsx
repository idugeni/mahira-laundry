import Link from "next/link";
import { MahiraLogo } from "@/components/brand/mahira-logo";

export default function KurirLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex bg-muted/30">
			<aside className="hidden lg:flex lg:w-64 flex-col border-r border-border bg-white">
				<div className="p-6 border-b border-border">
					<Link href="/">
						<MahiraLogo size={32} />
					</Link>
				</div>
				<div className="px-4 py-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Kurir Panel
					</span>
				</div>
				<nav className="flex-1 p-4 space-y-1">
					<Link
						href="/kurir/tugas"
						className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					>
						<span>🗺️</span>
						<span>Peta Tugas</span>
					</Link>
				</nav>
			</aside>
			<div className="flex-1 flex flex-col min-w-0">
				<header className="h-16 border-b border-border bg-white flex items-center px-6">
					<h2 className="font-semibold font-[family-name:var(--font-heading)]">
						Kurir Panel
					</h2>
				</header>
				<main className="flex-1 p-6 overflow-auto">{children}</main>
			</div>
		</div>
	);
}
