import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
	const supabase = await createClient();

	// Sign out the user
	const { error } = await supabase.auth.signOut();

	if (error) {
		return NextResponse.json(
			{ error: "Gagal melakukan sign out", details: error.message },
			{ status: 500 },
		);
	}

	// Clear cache and redirect to home
	revalidatePath("/", "layout");
	return NextResponse.redirect(new URL("/", request.url), {
		status: 302, // 302 ensures the redirect is followed by browsers correctly
	});
}
