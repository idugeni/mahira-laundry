import { protectPage } from "@/lib/auth/role-guards";
import { CustomerLayoutClient } from "./customer-layout-client";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
	const profile = await protectPage(["customer", "superadmin", "manager", "kasir", "kurir"]);

	return <CustomerLayoutClient profile={profile}>{children}</CustomerLayoutClient>;
}
