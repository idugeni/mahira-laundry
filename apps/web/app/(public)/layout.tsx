import { MahiraFooter } from "@/components/brand/mahira-footer";
import { MahiraHeader } from "@/components/brand/mahira-header";
import { BackToTop } from "@/components/shared/back-to-top";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const { data: services } = await supabase
		.from("services")
		.select("name, slug, id")
		.eq("is_active", true)
		.order("sort_order", { ascending: true })
		.limit(6);

	return (
		<>
			<MahiraHeader />
			<main className="flex-1">{children}</main>
			<MahiraFooter services={services || []} />
			<BackToTop />
		</>
	);
}
