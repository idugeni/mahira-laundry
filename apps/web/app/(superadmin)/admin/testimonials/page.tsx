import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminTestimonialsClient } from "@/components/shared/admin/testimonials/admin-testimonials-client";
import { createClient, getAllTestimonials } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Moderasi Testimoni",
	description: "Kelola ulasan dan testimoni pelanggan.",
};

export default async function AdminTestimonialsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Check admin role
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user?.id)
		.single();
	if (profile?.role !== "superadmin") {
		redirect("/dashboard");
	}

	const testimonials = await getAllTestimonials();

	return <AdminTestimonialsClient testimonials={testimonials} />;
}
