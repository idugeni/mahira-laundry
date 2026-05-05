import { AdminSidebar } from "@/components/shared/admin/admin-sidebar";
import { DynamicBreadcrumb } from "@/components/shared/admin/dynamic-breadcrumb";
import { protectPage } from "@/lib/auth/role-guards";
import { PRIMARY_OUTLET } from "@/lib/constants";

export const managerNav = [
	{
		label: "Utama",
		items: [
			{ href: "/manager", label: "Dashboard", icon: "🏠" },
			{ href: "/manager/analytics", label: "Analytics", icon: "📊" },
		],
	},
	{
		label: "Operasional",
		items: [
			{ href: "/manager/kelola-layanan", label: "Kelola Layanan", icon: "🧺" },
			{ href: "/manager/voucher", label: "Voucher", icon: "🎫" },
			{ href: "/manager/inventori", label: "Inventori", icon: "📦" },
		],
	},
	{
		label: "Tim",
		items: [{ href: "/manager/tim", label: "Tim", icon: "👥" }],
	},
];

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
	const profile = await protectPage(["manager"]);

	return (
		<div className="min-h-screen flex bg-slate-50/50">
			<AdminSidebar
				navItems={managerNav}
				panelLabel="Manager"
				panelBadgeColor="bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
				headerInfo={PRIMARY_OUTLET.name}
				profile={profile}
			/>
			<div className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0 min-h-screen">
				{/* Top Header (desktop only) */}
				<header className="hidden md:flex h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs items-center justify-between px-8 shadow-xs/30 sticky top-0 z-30">
					<DynamicBreadcrumb />

					<div className="flex items-center gap-3">
						<span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full truncate max-w-[200px]">
							📍 {PRIMARY_OUTLET.name}
						</span>
					</div>
				</header>
				{/* Main Content */}
				<main className="flex-1 p-4 md:p-8 flex items-start justify-center">
					<div className="w-full max-w-7xl">{children}</div>
				</main>
				{/* Dashboard Footer */}
				<footer className="p-4 md:p-6 border-t border-slate-200/80 text-center text-sm text-slate-500 bg-white/50 shrink-0">
					<p>© 2023-{new Date().getFullYear()} Mahira Group. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
}
