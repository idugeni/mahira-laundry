"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ServiceInput = {
  id?: string;
  outlet_id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  unit: string;
  price: number;
  estimated_duration_hours?: number;
  icon?: string;
  features?: string[];
  is_active?: boolean;
  is_express?: boolean;
  is_featured?: boolean;
};

export async function upsertService(data: ServiceInput) {
  try {
    const supabase = await createClient();

    const serviceData = {
      outlet_id: data.outlet_id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: data.category || "kiloan",
      unit: data.unit,
      price: data.price,
      estimated_duration_hours: data.estimated_duration_hours || 24,
      icon: data.icon || "🧺",
      features: data.features || [],
      is_active: data.is_active ?? true,
      is_express: data.is_express ?? false,
      is_featured: data.is_featured ?? false,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (data.id) {
      result = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", data.id);
    } else {
      result = await supabase
        .from("services")
        .insert(serviceData);
    }

    if (result.error) throw result.error;

    revalidatePath("/admin/layanan");
    revalidatePath("/kelola-layanan");
    revalidatePath("/manager");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Service action failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/layanan");
    revalidatePath("/kelola-layanan");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete service failed:", error);
    return { success: false, error: error.message };
  }
}
