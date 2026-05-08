import { Suspense } from "react";
import { MahiraFooter } from "@/components/brand/mahira-footer";
import { MahiraHeader } from "@/components/brand/mahira-header";
import { BackToTop } from "@/components/shared/common/back-to-top";
import { createClient, getUser, getUserProfile } from "@/lib/supabase/server";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen">
			<Suspense fallback={<div className="h-20" />}>
				<HeaderWrapper />
			</Suspense>
			<main key="public-main" className="flex-1 w-full min-w-0">
				{children}
			</main>
			<Suspense fallback={null}>
				<FooterWrapper />
			</Suspense>
			<BackToTop key="public-back-to-top" />
		</div>
	);
}

async function HeaderWrapper() {
	const [user, profile] = await Promise.all([getUser(), getUserProfile()]);
	return <MahiraHeader key="public-header" initialUser={user} initialProfile={profile} />;
}

async function FooterWrapper() {
	const supabase = await createClient();
	const { data: services } = await supabase
		.from("services")
		.select("name, slug, id")
		.eq("is_active", true)
		.order("sort_order", { ascending: true })
		.limit(6);

	return <MahiraFooter key="public-footer" services={services || []} />;
}
