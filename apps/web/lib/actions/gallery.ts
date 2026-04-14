"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";

export async function addGalleryItem(formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const file = formData.get("image") as File;
  
    if (!file) throw new Error("File gambar wajib diunggah.");
  
    // 1. Upload to Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `items/${fileName}`;
  
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file);
  
    if (uploadError) throw uploadError;
  
    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);
  
    // 3. Save to Database
    const { error: dbError } = await supabase
      .from("gallery")
      .insert({
        title,
        category,
        image_url: publicUrl,
      });
  
    if (dbError) {
      // Cleanup storage if database failing
      await supabase.storage.from("gallery").remove([filePath]);
      throw dbError;
    }
  
    revalidatePath("/", "layout");
    revalidatePath("/galeri");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("Add gallery item failed:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteGalleryItem(id: string, imageUrl: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
  
    // 1. Parse filename from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `items/${fileName}`;
  
    // 2. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .remove([filePath]);
  
    if (storageError) console.error("Storage delete error:", storageError);
  
    // 3. Delete from Database
    const { error: dbError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);
  
    if (dbError) throw dbError;
  
    revalidatePath("/", "layout");
    revalidatePath("/galeri");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("Delete gallery item failed:", err);
    return { success: false, error: err.message };
  }
}
