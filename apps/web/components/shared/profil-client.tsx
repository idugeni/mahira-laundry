"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HiOutlineUser, HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineCheckBadge } from "react-icons/hi2";

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  loyalty_tier: string;
  loyalty_points: number;
  addresses: any[];
}

interface ProfilClientProps {
  profile: Profile;
}

export function ProfilClient({ profile }: ProfilClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    // Add existing data that isn't in the form fields yet to prevent JSON.parse error
    formData.append("addresses", JSON.stringify(profile.addresses));
    formData.append("notification_preferences", JSON.stringify((profile as any).notification_preferences || {}));

    try {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profil berhasil diperbarui!");
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
          Profil <span className="text-brand-gradient">Saya</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Kelola informasi pribadi dan alamat pengiriman Anda.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col - Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
        >
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-brand-gradient opacity-10" />
                
                <div className="relative mt-4 mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto text-4xl border-4 border-white overflow-hidden">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=0f2a1e&color=fff&size=128`} 
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="flex items-center justify-center text-sm"><HiOutlineCheckBadge /></span>
                    </div>
                </div>

                <h2 className="text-xl font-black text-slate-900 leading-tight">{profile.full_name}</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">{profile.email}</p>

                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tier</span>
                        <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-black uppercase tracking-widest">
                            {profile.loyalty_tier}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">Poin</span>
                        <span className="text-lg font-black text-slate-900">{profile.loyalty_points}</span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Right Col - Forms */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
        >
             {/* Info Pribadi */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center"><HiOutlineUser /></span>
                        Informasi Pribadi
                    </h3>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/5 px-4 py-2 rounded-full transition-all"
                    >
                        {isEditing ? "Batal" : "Ubah"}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                    <HiOutlineUser />
                                </span>
                                <input 
                                    name="full_name"
                                    type="text" 
                                    defaultValue={profile.full_name}
                                    disabled={!isEditing}
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 disabled:opacity-60"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                    <HiOutlinePhone />
                                </span>
                                <input 
                                    name="phone"
                                    type="tel" 
                                    defaultValue={profile.phone || ""}
                                    disabled={!isEditing}
                                    placeholder="Belum diatur"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 disabled:opacity-60"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <HiOutlineEnvelope />
                            </span>
                            <input 
                                type="email" 
                                value={profile.email || ""}
                                disabled
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/10 outline-none font-bold text-slate-400"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </motion.button>
                    )}
                </form>
            </div>

            {/* Daftar Alamat */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-8">
                    <span className="w-8 h-8 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center"><HiOutlineMapPin /></span>
                    Alamat Tersimpan
                </h3>

                <div className="space-y-4">
                    {profile.addresses.length > 0 ? (
                        profile.addresses.map((addr: any, i: number) => (
                            <div key={i} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 flex items-center justify-between group hover:border-brand-primary/20 hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl text-slate-300 group-hover:text-brand-primary transition-colors">
                                        <HiOutlineMapPin />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{addr.label || "Alamat"}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{addr.detail}</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors">Hapus</button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem]">
                            <p className="text-sm font-bold text-slate-300">Belum ada alamat tersimpan.</p>
                            <button className="mt-4 text-xs font-black uppercase tracking-widest text-brand-primary hover:underline">Tambah Alamat</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
