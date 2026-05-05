import { protectPage } from "@/lib/auth/role-guards";
import { CustomerLayoutClient } from "@/app/(customer)/customer/customer-layout-client";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
	const profile = await protectPage(["customer"]);

	return <CustomerLayoutClient profile={profile}>{children}</CustomerLayoutClient>;
}
