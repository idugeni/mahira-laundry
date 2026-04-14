"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUrl } from "@/lib/utils";

export async function signUp(formData: FormData): Promise<void> {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		options: {
			data: {
				full_name: formData.get("full_name") as string,
				phone: formData.get("phone") as string,
				referred_by_code: formData.get("referred_by_code") as string,
				role: "customer",
			},
		},
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect(`/register?error=${encodeURIComponent(error.message)}`);
	}

	redirect("/register?success=verify-email");
}

export async function signIn(formData: FormData): Promise<void> {
	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error, data: authData } =
		await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect(`/login?error=${encodeURIComponent(error.message)}`);
	}

	let targetUrl = "/customer";
	if (authData?.user) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", authData.user.id)
			.single();

		targetUrl = getDashboardUrl(profile?.role);
	}

	revalidatePath("/", "layout");
	redirect(targetUrl);
}

export async function signOut(): Promise<void> {
	const supabase = await createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
	redirect("/login");
}

export async function resetPassword(formData: FormData): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase.auth.resetPasswordForEmail(
		formData.get("email") as string,
		{
			redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`,
		},
	);

	if (error) {
		redirect(`/lupa-password?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		"/lupa-password?success=Link reset password telah dikirim ke email Anda.",
	);
}

export async function signInWithGoogle(): Promise<void> {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
		},
	});

	if (error) {
		redirect(`/login?error=${encodeURIComponent(error.message)}`);
	}

	if (data.url) {
		redirect(data.url);
	}
}

export async function updatePassword(formData: FormData): Promise<void> {
	const supabase = await createClient();
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirm_password") as string;

	if (password !== confirmPassword) {
		redirect(`/reset-password?error=Password tidak cocok.`);
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
	}

	redirect(
		"/login?success=Password Anda berhasil diperbarui. Silakan masuk kembali.",
	);
}
