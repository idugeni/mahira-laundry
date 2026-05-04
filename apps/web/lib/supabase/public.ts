import { createClient } from "./auth";

export async function getPublishedTestimonials() {
	const supabase = await createClient();
	const { data: testimonials } = await supabase
		.from("testimonials")
		.select("*, profiles(full_name, avatar_url), guest_name")
		.eq("is_published", true)
		.order("created_at", { ascending: false })
		.limit(10);

	return testimonials || [];
}

export async function getAllTestimonials() {
	const supabase = await createClient();
	const { data: testimonials, error } = await supabase
		.from("testimonials")
		.select("*, profiles(full_name, avatar_url), guest_name")
		.order("created_at", { ascending: false });

	if (error) return [];
	return testimonials || [];
}
