// Barrel re-export — all functions remain importable from "@/lib/supabase/server"
// Domain modules contain the actual implementations.

export { createClient, getSession, getUser, getUserProfile } from "@/lib/supabase/auth";
export {
	getActiveBusinessPackages,
	getAllBusinessPackages,
	getBusinessPackageInquiries,
	getInquiryStats,
} from "@/lib/supabase/business-packages";
export {
	getDashboardStats,
	getLoyaltyHistory,
	getOrders,
	getRewards,
} from "@/lib/supabase/customer";
export { getAllInventory, getAllServices, getAllVouchers } from "@/lib/supabase/inventory";
export {
	getActiveVouchers,
	getLowStockItems,
	getManagerDashboardStats,
	getStaffList,
	getStaffManagementList,
} from "@/lib/supabase/manager";
export { getAllTestimonials, getPublishedTestimonials } from "@/lib/supabase/public";
export {
	getAuditLogs,
	getOrdersByDay,
	getOutletsWithStats,
	getPaymentMethodStats,
	getRecentExpenses,
	getRecentOrders,
	getSuperadminDashboardStats,
	getSuperadminRevenueByMonth,
} from "@/lib/supabase/superadmin";
