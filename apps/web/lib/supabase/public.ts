import { createClient } from "@/lib/supabase/auth";

export async function getPublishedTestimonials() {
	const supabase = await createClient();
	const { data: testimonials } = await supabase
		.from("testimonials")
		.select("*, profiles(full_name, avatar_url), guest_name")
		.eq("is_published", true)
		.order("created_at", { ascending: false })
		.limit(20);

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

export async function getPrimaryOutlet() {
	const supabase = await createClient();
	const { data: outlet } = await supabase
		.from("outlets")
		.select("*")
		.eq("is_active", true)
		.limit(1)
		.single();

	if (outlet) {
		return {
			id: outlet.id,
			name: outlet.name,
			slug: outlet.slug,
			address: outlet.address,
			phone: outlet.phone,
			whatsapp: outlet.whatsapp,
			whatsapp_clean: outlet.whatsapp?.replace(/[^0-9]/g, "") || "",
			email: outlet.email,
			lat: outlet.latitude,
			lng: outlet.longitude,
			operatingHours: {
				weekday: outlet.operating_hours?.weekday || "07:00-21:00",
				weekend: outlet.operating_hours?.weekend || "08:00-20:00",
			},
		};
	}

	// Fallback to constants if no outlet is found in the database
	return {
		id:
			typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
				? crypto.randomUUID()
				: "",
		name: "Mahira Laundry",
		slug: "mahira-laundry",
		address:
			"Jl. Cempaka Baru No.109, RT.002/RW.05, Jaticempaka, Kec. Pd. Gede, Kota Bks, Jawa Barat 13620",
		phone: "0838-0651-8859",
		whatsapp: "6283806518859",
		whatsapp_clean: "6283806518859",
		email: "hello@mahiralaundry.id",
		lat: -6.2621416,
		lng: 106.909272,
		operatingHours: {
			weekday: "08:00-19:00 (Sen 09:00-17:00)",
			weekend: "Sab 08:00-19:00, Minggu Tutup",
		},
	};
}
