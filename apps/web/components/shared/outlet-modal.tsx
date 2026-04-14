"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { upsertOutlet, uploadOutletImage } from "@/lib/actions/outlets";
import { toast } from "sonner";
import { Outlet } from "@/lib/types";
import { HiOutlineCamera, HiOutlineBuildingOffice, HiOutlineMapPin, HiOutlinePhone, HiOutlineCurrencyDollar, HiOutlineXMark } from "react-icons/hi2";

interface OutletModalProps {
  outlet?: Outlet;
  trigger?: React.ReactNode;
}

export function OutletModal({ outlet, trigger }: OutletModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(outlet?.image_url || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadOutletImage(outlet?.id || "temp", formData);
    if (result.success && result.data) {
      setImageUrl(result.data.url);
      toast.success("Foto outlet terunggah!");
    } else {
      toast.error(result.error || "Gagal mengunggah foto");
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: outlet?.id,
      name: formData.get("name") as string,
      slug: (formData.get("slug") as string).toLowerCase().replace(/\s+/g, "-"),
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      image_url: imageUrl,
      is_active: formData.get("is_active") === "on",
      is_franchise: formData.get("is_franchise") === "on",
      franchise_fee: Number(formData.get("franchise_fee")) || 0,
    };

    const result = await upsertOutlet(data);

    if (result.success) {
      toast.success(outlet ? "Outlet diperbarui" : "Outlet ditambahkan");
      setIsOpen(false);
    } else {
      toast.error(result.error || "Gagal menyimpan outlet");
    }
    setIsLoading(false);
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button className="px-6 py-3 bg-brand-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
            + Tambah Outlet
          </button>
        )}
      </div>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
            onClick={() => !isLoading && setIsOpen(false)} 
          />
          
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in border border-white/20">
            {/* Header with Pattern */}
            <div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
               <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
                    {outlet ? "Edit" : "Registrasi"} <span className="text-brand-primary">Outlet</span>
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    Kelola Konfigurasi Cabang Mahira Laundry
                  </p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300"
                >
                  <HiOutlineXMark size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Image Upload Section */}
                <div className="flex justify-center mb-2">
                  <div className="relative group/outlet-img w-full h-40 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center transition-all hover:border-brand-primary/30">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover/outlet-img:scale-110 duration-700" />
                    ) : (
                      <div className="text-center text-slate-300">
                        <div className="mx-auto mb-2 opacity-50">
                          <HiOutlineBuildingOffice size={48} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Unggah Foto Gerai</p>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/outlet-img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-[2px]">
                      <span className="text-white flex flex-col items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                        <HiOutlineCamera size={28} />
                        <span>{imageUrl ? "Ganti Foto" : "Pilih Foto"}</span>
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Gerai</label>
                    <input 
                      required name="name" defaultValue={outlet?.name || ""}
                      placeholder="Contoh: Salemba Prime"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug URL</label>
                    <input 
                      required name="slug" defaultValue={outlet?.slug || ""}
                      placeholder="salemba-prime"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                      <HiOutlineMapPin />
                    </span>
                    <textarea 
                      required name="address" defaultValue={outlet?.address || ""}
                      placeholder="Jl. Raya Salemba No. 123, Jakarta Pusat..."
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. Operasional</label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                        <HiOutlinePhone />
                      </span>
                      <input 
                        name="phone" defaultValue={outlet?.phone || ""}
                        placeholder="021-..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Franchise Fee (%)</label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                        <HiOutlineCurrencyDollar />
                      </span>
                      <input 
                        type="number" name="franchise_fee" defaultValue={outlet?.franchise_fee || 0}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-5 bg-slate-100/50 rounded-2xl border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer group/check">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" name="is_active" defaultChecked={outlet ? outlet.is_active : true} className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-white checked:border-emerald-500 checked:bg-emerald-500 transition-all" />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-xs">✓</span>
                    </div>
                    <span className="text-sm font-black text-slate-600 group-hover/check:text-slate-900 transition-colors">Aktif</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group/check">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" name="is_franchise" defaultChecked={outlet?.is_franchise} className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-white checked:border-brand-primary checked:bg-brand-primary transition-all" />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-xs">✓</span>
                    </div>
                    <span className="text-sm font-black text-slate-600 group-hover/check:text-slate-900 transition-colors">Franchise</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="button" onClick={() => setIsOpen(false)} disabled={isLoading}
                    className="flex-1 py-4 text-sm font-black text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit" disabled={isLoading}
                    className="flex-[2] py-4 text-sm font-black text-white bg-brand-primary rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {outlet ? "Update Outlet" : "Simpan Outlet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
