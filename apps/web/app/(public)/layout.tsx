import { MahiraFooter } from "@/components/brand/mahira-footer";
import { MahiraHeader } from "@/components/brand/mahira-header";
import { BackToTop } from "@/components/shared/common/back-to-top";
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
		<div className="flex flex-col min-h-screen">
			<MahiraHeader key="public-header" />
			<main
				key="public-main"
				className="flex-1 flex items-start justify-center"
			>
				{children}
			</main>
			<MahiraFooter key="public-footer" services={services || []} />
			<BackToTop key="public-back-to-top" />
		</div>
	);
}
