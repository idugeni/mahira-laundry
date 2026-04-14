import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { PRIMARY_OUTLET } from "@/lib/constants";

const managerNav = [
  { href: "/manager", label: "Dashboard", icon: "🏠" },
  { href: "/manager/analytics", label: "Analytics", icon: "📊" },
  { href: "/manager/kelola-layanan", label: "Kelola Layanan", icon: "🧺" },
  { href: "/manager/voucher", label: "Voucher", icon: "🎫" },
  { href: "/manager/inventori", label: "Inventori", icon: "📦" },
  { href: "/manager/tim", label: "Tim", icon: "👥" },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50/50">
      <AdminSidebar
        navItems={managerNav}
        panelLabel="Manager"
        panelBadgeColor="bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
        headerInfo={PRIMARY_OUTLET.name}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 lg:h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 mt-14 lg:mt-0 shadow-sm/30">
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
            <span className="font-medium text-slate-600">Mahira Laundry</span>
            <span>/</span>
            <span>Panel Manager</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full truncate max-w-[200px]">
              📍 {PRIMARY_OUTLET.name}
            </span>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
