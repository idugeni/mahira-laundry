"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { toast } from "sonner";
import { 
  HiOutlineCloudArrowUp, 
  HiOutlineTrash, 
  HiOutlinePhoto,
  HiOutlinePlus
} from "react-icons/hi2";
import { addGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery";
import { Button } from "@/components/ui/button";

const categories = ["Hasil Cucian", "Fasilitas", "Proses", "Lainnya"];

export function AdminGalleryClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const promise = addGalleryItem(formData);

    toast.promise(promise, {
      loading: "Mengunggah foto...",
      success: () => {
        setIsUploading(false);
        setPreview(null);
        // Refresh items would be better via revalidate, but we fake it for speed if needed
        window.location.reload(); 
        return "Foto berhasil ditambahkan!";
      },
      error: (err: any) => {
        setIsUploading(false);
        return err.message || "Gagal mengunggah foto.";
      }
    });
  }

  async function handleDelete(id: string, imageUrl: string) {
    if (!confirm("Hapus foto ini dari galeri?")) return;

    const promise = deleteGalleryItem(id, imageUrl);

    toast.promise(promise, {
      loading: "Menghapus...",
      success: () => {
        setItems(items.filter(i => i.id !== id));
        return "Foto berhasil dihapus.";
      },
      error: "Gagal menghapus foto."
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
            Kelola Galeri
          </h1>
          <p className="text-slate-500 mt-1">Tambahkan bukti kualitas layanan Mahira Laundry.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleUpload} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center text-brand-primary">
                <HiOutlinePlus />
              </span>
              Tambah Foto Baru
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Judul Foto</label>
                <input 
                  name="title" 
                  required 
                  placeholder="Misal: Hasil Deep Cleaning Sepatu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-brand-primary outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Kategori</label>
                <select 
                  name="category" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:border-brand-primary outline-none transition-all text-sm"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Pilih File</label>
                <div className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-100 overflow-hidden group hover:border-brand-primary transition-all">
                  {preview ? (
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                      <span className="w-8 h-8 flex items-center justify-center">
                        <HiOutlineCloudArrowUp />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Klik untuk Pilih</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    name="image" 
                    required 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full py-6 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold shadow-xl shadow-brand-primary/20 transition-all"
              >
                {isUploading ? "Mengunggah..." : "Simpan ke Galeri"}
              </Button>
            </div>
          </form>
        </div>

        {/* List Items */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-300">
              <span className="w-12 h-12 flex items-center justify-center mb-4">
                <HiOutlinePhoto />
              </span>
              <p className="font-bold">Galeri masih kosong</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleDelete(item.id, item.image_url)}
                        className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-red-100/20"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          <HiOutlineTrash />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1 block">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
