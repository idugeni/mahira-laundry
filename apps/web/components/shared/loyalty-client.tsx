"use client";

import { motion } from "motion/react";
import { HiOutlineTrophy, HiOutlineBolt, HiOutlineClipboardDocumentCheck, HiOutlineShare, HiOutlineGift } from "react-icons/hi2";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface LoyaltyHistory {
  id: string;
  points: number;
  type: string;
  description: string;
  created_at: string;
}

interface Profile {
  full_name: string;
  loyalty_tier: string;
  loyalty_points: number;
  referral_code: string | null;
  created_at: string;
}

interface LoyaltyClientProps {
  profile: Profile;
  history: LoyaltyHistory[];
}

export function LoyaltyClient({ profile, history }: LoyaltyClientProps) {
  const nextTierPoints = profile.loyalty_tier === "bronze" ? 500 : profile.loyalty_tier === "silver" ? 2000 : profile.loyalty_tier === "gold" ? 5000 : 0;
  const progress = nextTierPoints > 0 ? (profile.loyalty_points / nextTierPoints) * 100 : 100;
  const remainingPoints = nextTierPoints > profile.loyalty_points ? nextTierPoints - profile.loyalty_points : 0;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
            Loyalty <span className="inline-block text-brand-gradient">& Poin</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Kumpulkan poin setiap transaksi dan nikmati hadiah eksklusif.
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl text-amber-500 shadow-inner">
           <span className="flex items-center justify-center"><HiOutlineTrophy /></span>
        </div>
      </div>

      {/* Tier card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 text-[120px] text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <HiOutlineBolt />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full w-fit mb-6 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                {profile.loyalty_tier} Member
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-[family-name:var(--font-heading)] mb-2">
              {profile.full_name}
            </div>
            <p className="text-white/40 font-medium tracking-wide">
              Bergabung sejak {format(new Date(profile.created_at), "MMMM yyyy", { locale: id })}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] text-center min-w-[200px]">
            <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Saldo Poin</div>
            <div className="text-5xl font-black font-[family-name:var(--font-heading)] text-brand-accent">
              {profile.loyalty_points}
            </div>
          </div>
        </div>

        {nextTierPoints > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-white/60">Progres ke {profile.loyalty_tier === "bronze" ? "Silver" : profile.loyalty_tier === "silver" ? "Gold" : "Platinum"} Tier</span>
              {remainingPoints > 0 ? (
                <span className="text-brand-accent italic">{remainingPoints} poin lagi</span>
              ) : (
                <span className="text-emerald-400 font-black">Tier Maksimal!</span>
              )}
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 p-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-brand-gradient h-2 rounded-full shadow-lg shadow-brand-primary/20"
              />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
              <span className="opacity-50">{profile.loyalty_tier.toUpperCase()} (0)</span>
              <span>{profile.loyalty_tier === "bronze" ? "SILVER (500)" : profile.loyalty_tier === "silver" ? "GOLD (2000)" : "PLATINUM (5000)"}</span>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Referral */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                    <HiOutlineShare />
                </div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
                    Ajak Teman
                </h2>
            </div>
            <p className="text-slate-500 font-medium mb-6">
                Dapatkan 50 poin gratis untuk setiap teman yang mendaftar menggunakan kode Anda.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex-1 text-center font-mono text-xl font-black tracking-widest text-slate-800">
              {profile.referral_code || "MHR-UNSET"}
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
              Salin
            </button>
          </div>
        </motion.div>

        {/* Rewards */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl">
                    <HiOutlineGift />
                </div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
                    Tukar Hadiah
                </h2>
          </div>
          <div className="space-y-4">
             {[
                 { name: "Voucher Diskon 20%", cost: 200 },
                 { name: "Gratis Express Upgrade", cost: 150 },
                 { name: "Merchandise Mahira", cost: 500 },
             ].map(r => (
                 <div key={r.name} className="flex items-center justify-between p-4 rounded-3xl border border-slate-50 hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all">
                    <span className="font-bold text-slate-700">{r.name}</span>
                    <span className="text-xs font-black px-3 py-1 bg-white border border-slate-100 rounded-lg text-brand-primary">{r.cost} Pts</span>
                 </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* History */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl">
                <HiOutlineClipboardDocumentCheck />
            </div>
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
                Riwayat Poin
            </h2>
        </div>
        
        {history.length > 0 ? (
            <div className="space-y-6">
                {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${item.points > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                {item.points > 0 ? "+" : ""}{item.points}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">{item.description}</p>
                                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                                    {format(new Date(item.created_at), "dd MMM yyyy • HH:mm", { locale: id })}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-tighter">
                            {item.type}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="font-black text-slate-400 text-lg">Belum ada transaksi poin.</p>
                <p className="text-sm text-slate-400 mt-2 font-medium">Lakukan order untuk mulai mengumpulkan poin!</p>
            </div>
        )}
      </div>
    </div>
  );
}
