import Link from "next/link";
import { KasirMobileNav } from "@/app/(kasir)/kasir/kasir-mobile-nav";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { AdminAvatarDropdown } from "@/components/shared/admin/admin-avatar-dropdown";
import { DynamicBreadcrumb } from "@/components/shared/admin/dynamic-breadcrumb";
import { protectPage } from "@/lib/auth/role-guards";
import { PRIMARY_OUTLET } from "@/lib/constants";

export const kasirNav = [
	{ href: "/kasir", label: "POS Kasir", icon: "💰" },
	{ href: "/kasir/antrian", label: "Antrian", icon: "📋" },
	{ href: "/kasir/shift", label: "Shift", icon: "🕐" },
];

export default async function KasirLayout({ children }: { children: React.ReactNode }) {
	const profile = await protectPage(["kasir"]);

	return (
		<div className="min-h-screen flex bg-muted/30">
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-white">
				<div className="p-6 border-b border-border">
					<Link href="/">
						<MahiraLogo size={32} />
					</Link>
				</div>
				<div className="px-4 py-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Kasir Panel
					</span>
				</div>
				<nav className="flex-1 p-4 space-y-1">
					{kasirNav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						>
							<span>{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					))}
				</nav>
			</aside>

			{/* Mobile Nav Component (Client-side) */}
			<KasirMobileNav navItems={kasirNav} />

			<div className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0">
				<header className="hidden md:flex h-16 border-b border-border bg-white items-center justify-between px-6 sticky top-0 z-30">
					<DynamicBreadcrumb />
					<div className="flex items-center gap-4">
						<span className="text-xs text-muted-foreground hidden sm:inline-block">
							{PRIMARY_OUTLET.name}
						</span>
						<AdminAvatarDropdown
							fullName={profile?.full_name}
							avatarUrl={profile?.avatar_url}
							panelLabel="Kasir"
							panelBadgeColor="bg-blue-500 text-white"
							headerInfo={PRIMARY_OUTLET.name}
							profileHref="/kasir/profil"
						/>
					</div>
				</header>
				<main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
				<footer className="p-4 md:p-6 border-t border-border text-center text-sm text-muted-foreground bg-white/50 shrink-0">
					<p>© 2023-{new Date().getFullYear()} Mahira Group. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
}
