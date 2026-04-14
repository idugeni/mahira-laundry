"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { registerStaffMember } from "@/lib/actions/staff";
import { HiOutlineUserPlus, HiOutlineEnvelope, HiOutlinePhone, HiOutlineLockClosed, HiOutlineXMark } from "react-icons/hi2";
import { Outlet, UserRole } from "@/lib/types";

interface RegisterStaffModalProps {
  outlets: Outlet[];
}

export function RegisterStaffModal({ outlets }: RegisterStaffModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as "manager" | "kasir" | "kurir",
      outletId: formData.get("outletId") as string,
      password: (formData.get("password") as string) || "Mahira123!",
    };

    const result = await registerStaffMember(data);

    if (result.success) {
      setIsOpen(false);
      // Revalidation is handled by server action revalidatePath
    } else {
      setError(result.error || "Terjadi kesalahan saat mendaftarkan staf.");
    }
    setIsLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <HiOutlineUserPlus size={18} />
        <span>Registrasi Staf Baru</span>
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
            onClick={() => !isLoading && setIsOpen(false)} 
          />
          
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in border border-white/20">
            {/* Header with Background Pattern */}
            <div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
                    Registrasi <span className="text-brand-primary">Staf</span>
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    Panel Administrasi Mahira Laundry Group
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

            {/* Form Content - Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-3 animate-head-shake">
                    <span className="text-base">⚠️</span>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Sesuai KTP</label>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                      <HiOutlineUserPlus />
                    </span>
                    <input 
                      required name="fullName"
                      placeholder="Contoh: Muhammad Rafli"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Kerja</label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                        <HiOutlineEnvelope />
                      </span>
                      <input 
                        required type="email" name="email"
                        placeholder="staf@mahira.id"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                    <div className="relative group/input">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                        <HiOutlinePhone />
                      </span>
                      <input 
                        required name="phone"
                        placeholder="0812..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peran Akses</label>
                    <select 
                      required name="role"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer hover:bg-slate-100/50"
                    >
                      <option value="kasir">Kasir Operasional</option>
                      <option value="kurir">Kurir Penjemputan</option>
                      <option value="manager">Manager Outlet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Penempatan Cabang</label>
                    <select 
                      required name="outletId"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer hover:bg-slate-100/50"
                    >
                      <option value="">Pilih Outlet</option>
                      {outlets.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mx-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Akses Password</label>
                    <span className="text-[9px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Default: Mahira123!</span>
                  </div>
                  <div className="relative group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                      <HiOutlineLockClosed />
                    </span>
                    <input 
                      type="password" name="password"
                      placeholder="Biarkan kosong untuk menggunakan password default"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                    className="flex-1 py-4 text-sm font-black text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-4 text-sm font-black text-white bg-brand-primary rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Simpan & Aktifkan Staf</span>
                      </>
                    )}
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
