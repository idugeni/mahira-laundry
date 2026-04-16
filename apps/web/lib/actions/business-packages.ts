"use server";

import { revalidatePath } from "next/cache";
import {
	createClient,
	getActiveBusinessPackages as queryGetActiveBusinessPackages,
	getAllBusinessPackages as queryGetAllBusinessPackages,
} from "@/lib/supabase/server";
import type {
	ActionResponse,
	BusinessPackage,
	CreatePackageInput,
	UpdatePackageInput,
} from "@/lib/types";

export async function getActiveBusinessPackages(): Promise<BusinessPackage[]> {
	return queryGetActiveBusinessPackages();
}

export async function getAllBusinessPackages(): Promise<BusinessPackage[]> {
	return queryGetAllBusinessPackages();
}

export async function createBusinessPackage(
	data: CreatePackageInput,
): Promise<ActionResponse<BusinessPackage>> {
	try {
		if (
			data.promo_price != null &&
			data.price != null &&
			data.promo_price >= data.price
		) {
			return {
				success: false,
				error: "Harga promo harus lebih kecil dari harga normal.",
			};
		}

		const supabase = await createClient();
		const { data: created, error } = await supabase
			.from("business_packages")
			.insert(data)
			.select()
			.single();

		if (error) throw error;

		revalidatePath("/paket-usaha");
		return { success: true, data: created as BusinessPackage };
	} catch (error) {
		const err = error as Error;
		console.error("createBusinessPackage failed:", err);
		return { success: false, error: err.message };
	}
}

export async function updateBusinessPackage(
	id: string,
	data: UpdatePackageInput,
): Promise<ActionResponse<BusinessPackage>> {
	try {
		if (
			data.promo_price != null &&
			data.price != null &&
			data.promo_price >= data.price
		) {
			return {
				success: false,
				error: "Harga promo harus lebih kecil dari harga normal.",
			};
		}

		const supabase = await createClient();
		const { data: updated, error } = await supabase
			.from("business_packages")
			.update(data)
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;

		revalidatePath("/paket-usaha");
		return { success: true, data: updated as BusinessPackage };
	} catch (error) {
		const err = error as Error;
		console.error("updateBusinessPackage failed:", err);
		return { success: false, error: err.message };
	}
}

export async function deleteBusinessPackage(
	id: string,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const { count, error: countError } = await supabase
			.from("business_package_inquiries")
			.select("*", { count: "exact", head: true })
			.eq("package_id", id);

		if (countError) throw countError;

		if (count && count > 0) {
			return {
				success: false,
				error: `Paket tidak dapat dihapus karena memiliki ${count} inquiry terkait. Nonaktifkan paket sebagai gantinya.`,
			};
		}

		const { error } = await supabase
			.from("business_packages")
			.delete()
			.eq("id", id);

		if (error) throw error;

		revalidatePath("/paket-usaha");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		console.error("deleteBusinessPackage failed:", err);
		return { success: false, error: err.message };
	}
}

export async function toggleBusinessPackageActive(
	id: string,
	isActive: boolean,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("business_packages")
			.update({ is_active: isActive })
			.eq("id", id);

		if (error) throw error;

		revalidatePath("/paket-usaha");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		console.error("toggleBusinessPackageActive failed:", err);
		return { success: false, error: err.message };
	}
}
