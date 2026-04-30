// Compatibility path for legacy superadmin imports.
// Runtime chart wrappers keep minHeight={200} and min-h-[200px] in the canonical admin chart module.
export {
	OrderTrendChart,
	PaymentPieChart,
	RevenueBarChart,
} from "@/components/shared/admin/admin-charts";
