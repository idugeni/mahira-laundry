"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatIDR } from "@/lib/utils";
import { 
  HiOutlineMapPin, 
  HiOutlineSparkles, 
  HiOutlineChevronRight, 
  HiOutlineChevronLeft,
  HiOutlineCheckCircle,
  HiOutlineBuildingOffice,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineCalendarDays
} from "react-icons/hi2";
import { MdOutlineLocalLaundryService, MdOutlineIron, MdOutlineFlashOn, MdOutlineDryCleaning } from "react-icons/md";
import { IconType } from "react-icons";

const steps = [
  { name: "Pilih Outlet", icon: HiOutlineBuildingOffice },
  { name: "Pilih Layanan", icon: HiOutlineSparkles },
  { name: "Detail", icon: HiOutlineMapPin },
  { name: "Konfirmasi", icon: HiOutlineCheckCircle },
];

const outlets = [
  { name: "Mahira Laundry Salemba", address: "Jl. Salemba Raya No. 28, Jakarta Pusat", id: "salemba" },
  { name: "Mahira Laundry Menteng", address: "Jl. Menteng Raya No. 15, Jakarta Pusat", id: "menteng" },
  { name: "Mahira Laundry Cikini", address: "Jl. Cikini Raya No. 42, Jakarta Pusat", id: "cikini" },
];

interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
  icon: any;
  desc: string;
}

const services: Service[] = [
  { 
    id: "cuci-setrika",
    name: "Cuci Setrika Reguler", 
    price: 10000, 
    unit: "kg", 
    icon: MdOutlineIron,
    desc: "Cuci bersih, setrika rapi, 24 jam"
  },
  { 
    id: "express",
    name: "Express Cuci Setrika", 
    price: 15000, 
    unit: "kg", 
    icon: MdOutlineFlashOn,
    desc: "Layanan kilat selesai dalam 6 jam"
  },
  { 
    id: "dry-clean",
    name: "Dry Cleaning", 
    price: 25000, 
    unit: "item", 
    icon: MdOutlineDryCleaning,
    desc: "Untuk jas, gaun, dan bahan sensitif"
  },
];

export function OrderClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + delta, 0)
    }));
  };

  const calculateTotal = () => {
    let subtotal = 0;
    services.forEach(s => {
      subtotal += (quantities[s.id] || 0) * s.price;
    });
    return subtotal;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
          Buat <span className="inline-block text-brand-gradient">Order Baru</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Dapatkan cucian bersih dan rapi hanya dalam beberapa langkah.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 pointer-events-none" />
        {steps.map((step, i) => (
          <div key={step.name} className="relative z-10 flex flex-col items-center">
            <div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-slate-50 ${
                i <= currentStep ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30" : "bg-white text-slate-300"
              }`}
            >
              <span className="text-xl"><step.icon /></span>
            </div>
            <span className={`absolute -bottom-8 whitespace-nowrap text-xs font-black uppercase tracking-widest ${
                i <= currentStep ? "text-brand-primary" : "text-slate-300"
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-2">Pilih Outlet Terdekat</h2>
              {outlets.map((outlet) => (
                <button
                  key={outlet.id}
                  onClick={() => { setSelectedOutlet(outlet.id); handleNext(); }}
                  className={`group w-full p-8 rounded-3xl border-2 text-left transition-all ${
                    selectedOutlet === outlet.id ? "border-brand-primary bg-brand-primary-light/10" : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                        selectedOutlet === outlet.id ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-primary/10"
                      } transition-colors`}>
                        <HiOutlineBuildingOffice />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-lg">{outlet.name}</div>
                        <div className="text-slate-500 text-sm font-medium mt-1 inline-flex items-center gap-2">
                           <span className="flex items-center justify-center text-brand-primary"><HiOutlineMapPin /></span>
                           {outlet.address}
                        </div>
                      </div>
                    </div>
                    <span className={`text-2xl transition-transform flex items-center justify-center ${selectedOutlet === outlet.id ? "translate-x-1" : "text-slate-200"}`}>
                      <HiOutlineChevronRight />
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-2">Pilih Layanan & Jumlah</h2>
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-8 rounded-3xl border border-slate-100 bg-white flex flex-wrap items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center text-3xl">
                      <service.icon />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-lg">{service.name}</div>
                      <div className="text-slate-500 text-sm font-medium">{service.desc}</div>
                      <div className="mt-2 text-brand-primary font-black">
                        {formatIDR(service.price)}<span className="text-xs text-slate-400">/{service.unit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                    <button 
                      onClick={() => updateQuantity(service.id, -1)}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                    >
                      <HiOutlineChevronLeft />
                    </button>
                    <span className="w-12 text-center font-black text-lg text-slate-900">
                      {quantities[service.id] || 0}
                    </span>
                    <button 
                      onClick={() => updateQuantity(service.id, 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                    >
                      <HiOutlineChevronRight />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-8">
                <button
                  onClick={handleNext}
                  disabled={calculateTotal() === 0}
                  className="px-10 py-4 bg-brand-primary text-white rounded-full font-black disabled:opacity-50 shadow-xl shadow-brand-primary/20 flex items-center gap-3 transition-all hover:scale-105"
                >
                  Lanjutkan
                  <span className="flex items-center justify-center"><HiOutlineChevronRight /></span>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-xl font-bold text-slate-900">Detail Pengiriman</h2>
              <div className="grid gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest mb-3">
                    <span className="text-brand-primary flex items-center justify-center"><HiOutlineTruck /></span>
                    Alamat Jemput
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan alamat lengkap penjemputan..."
                    className="w-full px-6 py-4 rounded-3xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest mb-3">
                      <span className="text-brand-primary flex items-center justify-center"><HiOutlineCalendarDays /></span>
                      Tanggal Jemput
                    </label>
                    <input
                      type="date"
                      className="w-full px-6 py-4 rounded-3xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest mb-3">
                      <span className="text-brand-primary flex items-center justify-center"><HiOutlineClock /></span>
                      Waktu Jemput
                    </label>
                    <select className="w-full px-6 py-4 rounded-3xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium">
                      <option>08:00 - 12:00</option>
                      <option>12:00 - 16:00</option>
                      <option>16:00 - 20:00</option>
                    </select>
                  </div>
                </div>
              </div>
               <div className="flex justify-end pt-8">
                <button
                  onClick={handleNext}
                  className="px-10 py-4 bg-brand-primary text-white rounded-full font-black shadow-xl shadow-brand-primary/20 flex items-center gap-3 transition-all hover:scale-105"
                >
                  Lanjutkan
                  <span className="flex items-center justify-center"><HiOutlineChevronRight /></span>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-xl font-bold text-slate-900">Ringkasan Pesanan</h2>
              <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 text-6xl text-white/5 pointer-events-none">
                    <HiOutlineCheckCircle />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center pb-6 border-b border-white/10">
                    <span className="text-white/60 font-medium">Outlet</span>
                    <span className="font-bold">{outlets.find(o => o.id === selectedOutlet)?.name}</span>
                  </div>
                  <div className="space-y-4">
                    {services.map(s => quantities[s.id] > 0 && (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span className="text-white/60">{s.name} x {quantities[s.id]}</span>
                        <span className="font-bold">{formatIDR(quantities[s.id] * s.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center py-6 border-y border-white/10">
                    <span className="text-white/60 font-medium font-mono text-xs uppercase tracking-widest">Biaya Pengiriman</span>
                    <span className="font-bold text-emerald-400">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-xl font-black">Total Pembayaran</span>
                    <span className="text-3xl font-black text-brand-accent">
                        {formatIDR(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full py-6 bg-brand-primary text-white rounded-3xl font-black text-xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                Konfirmasi & Bayar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {currentStep > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-start">
             <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase tracking-widest text-xs"
            >
              <span className="flex items-center justify-center"><HiOutlineChevronLeft /></span>
              Kembali
            </button>
        </div>
      )}
    </div>
  );
}
