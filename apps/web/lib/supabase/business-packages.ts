import { createClient } from "@/lib/supabase/auth";
import type {
	BusinessPackage,
	BusinessPackageInquiry,
	InquiryFilters,
	InquiryStats,
} from "@/lib/types";

export async function getActiveBusinessPackages(): Promise<BusinessPackage[]> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("business_packages")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });
	return (data as BusinessPackage[]) || [];
}

export async function getAllBusinessPackages(): Promise<BusinessPackage[]> {
	const supabase = await createClient();
	const { data } = await supabase
		.from("business_packages")
		.select("*")
		.order("sort_order", { ascending: true });
	return (data as BusinessPackage[]) || [];
}

export async function getBusinessPackageInquiries(
	filters?: InquiryFilters,
): Promise<BusinessPackageInquiry[]> {
	const supabase = await createClient();
	let query = supabase
		.from("business_package_inquiries")
		.select("*, business_packages(name)")
		.order("created_at", { ascending: false });

	if (filters?.status) {
		query = query.eq("status", filters.status);
	}
	if (filters?.package_id) {
		query = query.eq("package_id", filters.package_id);
	}
	if (filters?.package_name) {
		query = query.ilike("package_name", `%${filters.package_name}%`);
	}
	if (filters?.date_from) {
		query = query.gte("created_at", filters.date_from);
	}
	if (filters?.date_to) {
		query = query.lte("created_at", filters.date_to);
	}

	const { data } = await query;
	return (data as BusinessPackageInquiry[]) || [];
}

export async function getInquiryStats(): Promise<InquiryStats> {
	const supabase = await createClient();
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const { data } = await supabase
		.from("business_package_inquiries")
		.select("status")
		.gte("created_at", thirtyDaysAgo.toISOString());

	const rows = data || [];
	return {
		total: rows.length,
		new: rows.filter((r) => r.status === "new").length,
		negotiating: rows.filter((r) => r.status === "negotiating").length,
		converted: rows.filter((r) => r.status === "converted").length,
	};
}
