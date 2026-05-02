// Barrel re-export — all functions remain importable from "@/lib/supabase/server"
// Domain modules contain the actual implementations.

export { createClient, getSession, getUser, getUserProfile } from "./auth";
export {
	getActiveBusinessPackages,
	getAllBusinessPackages,
	getBusinessPackageInquiries,
	getInquiryStats,
} from "./business-packages";
export {
	getDashboardStats,
	getLoyaltyHistory,
	getOrders,
	getRewards,
} from "./customer";
export { getAllInventory, getAllServices, getAllVouchers } from "./inventory";
export {
	getActiveVouchers,
	getLowStockItems,
	getManagerDashboardStats,
	getStaffList,
	getStaffManagementList,
} from "./manager";
export { getAllTestimonials, getPublishedTestimonials } from "./public";
export {
	getAuditLogs,
	getOrdersByDay,
	getOutletsWithStats,
	getPaymentMethodStats,
	getRecentExpenses,
	getRecentOrders,
	getSuperadminDashboardStats,
	getSuperadminRevenueByMonth,
} from "./superadmin";
