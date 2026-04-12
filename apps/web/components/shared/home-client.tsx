"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { HiOutlineSparkles, HiOutlineArrowRight, HiOutlineMapPin } from "react-icons/hi2";
import { MdOutlineLocalLaundryService, MdOutlineIron, MdOutlineFlashOn, MdOutlineDryCleaning, MdOutlineCheckCircle } from "react-icons/md";
import { GiChelseaBoot } from "react-icons/gi";
import { RiGraduationCapLine } from "react-icons/ri";
import { OUTLET_SALEMBA } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa6";
import { IconType } from "react-icons";

interface Service {
  icon: IconType;
  name: string;
  price: string;
  desc: string;
  color: string;
  bg: string;
}

const services: Service[] = [
  {
    icon: MdOutlineLocalLaundryService,
    name: "Cuci Lipat",
    price: "Rp 7.000/kg",
    desc: "Cuci bersih dan dilipat rapi",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: MdOutlineIron,
    name: "Cuci Setrika",
    price: "Rp 10.000/kg",
    desc: "Cuci, setrika, dan lipat rapi",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: MdOutlineFlashOn,
    name: "Express",
    price: "Rp 15.000/kg",
    desc: "Selesai dalam 6 jam",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: MdOutlineDryCleaning,
    name: "Dry Cleaning",
    price: "Rp 25.000/item",
    desc: "Untuk pakaian formal & sensitif",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: GiChelseaBoot,
    name: "Cuci Sepatu",
    price: "Rp 35.000/pasang",
    desc: "Deep cleaning segala jenis sepatu",
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
  {
    icon: RiGraduationCapLine,
    name: "Paket Kost",
    price: "Rp 8.000/kg",
    desc: "Hemat untuk anak kos",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
];

const stats = [
  { value: "10K+", label: "Order Selesai" },
  { value: "4.9", label: "Rating" },
  { value: "3", label: "Outlet Jakarta" },
  { value: "24/7", label: "Tracking Online" },
];

export function HomeClient() {
  return (
    <div className="overflow-hidden">
        {/* Schema.org JSON-LD will be injected by the server component */}
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-40">
        <div className="absolute inset-0 bg-brand-gradient opacity-[0.03]" />
        <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-primary rounded-full blur-[120px]" 
        />
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent rounded-full blur-[100px]" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-semibold mb-8 border border-brand-primary/10"
              >
                <span className="w-4 h-4 flex items-center justify-center animate-pulse"><HiOutlineSparkles /></span>
                <span>Layanan Premium Jakarta Salemba</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold font-[family-name:var(--font-heading)] leading-[1.1] tracking-tight text-slate-900">
                Cucian Bersih,<br />
                <span className="inline-block text-brand-gradient">Hidup Nyaman.</span>
              </h1>
              
              <p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-lg">
                Mahira Laundry hadir di Salemba sebagai standar baru layanan laundry. 
                Pakaian Anda ditangani secara profesional dengan antar-jemput gratis.
              </p>

              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-5">
                <Link
                  href="/register"
                  className="group relative px-8 py-4 bg-brand-primary text-white rounded-full font-bold overflow-hidden transition-all hover:shadow-2xl hover:shadow-brand-primary/30"
                >
                  <motion.div 
                    className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" 
                  />
                  <span className="relative flex items-center gap-2">
                    Mulai Sekarang
                    <span className="w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform"><HiOutlineArrowRight /></span>
                  </span>
                </Link>
                <Link
                  href="/layanan"
                  className="px-8 py-4 border-2 border-slate-200 rounded-full font-bold text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-2"
                >
                  Lihat Layanan
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 max-w-sm mx-auto lg:mx-0">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-slate-200 border-4 border-white overflow-hidden shadow-sm"
                    >
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Pelanggan" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-500 text-sm">
                    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    <strong className="text-slate-900">2,500+</strong> pelanggan puas
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
            >
              <div className="relative z-10 glass-card p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-white/40 ring-1 ring-black/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-3xl text-brand-primary shadow-inner">
                    <MdOutlineLocalLaundryService />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Order Aktif</h3>
                    <p className="text-sm text-slate-500 font-medium">Pickup dalam 30 menit</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    "Cuci Setrika 3kg",
                    "Dry Cleaning 2 item",
                    "Express Setrika 1kg",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <span className="text-sm font-semibold text-slate-700">{item}</span>
                      <span className="text-emerald-500 w-5 h-5 flex items-center justify-center"><MdOutlineCheckCircle /></span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pembayaran</p>
                      <p className="text-2xl font-black text-brand-primary mt-1">Rp 85.000</p>
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold ring-1 ring-emerald-100 uppercase">
                    Paid
                  </div>
                </div>
              </div>

              {/* Float Element */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -right-8 z-20 glass-card p-5 shadow-2xl ring-1 ring-black/5 flex items-center gap-4 max-w-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-2xl">
                    <span className="text-brand-accent flex items-center justify-center"><HiOutlineMapPin /></span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Kurir Mahira</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">Sedang Menuju Salemba</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative bg-[#0f2a1e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="text-4xl lg:text-5xl font-black text-brand-accent font-[family-name:var(--font-heading)] mb-2">
                            {stat.value}
                        </div>
                        <div className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-slate-50/50" id="layanan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-slate-900"
            >
              Layanan <span className="inline-block text-brand-gradient">Premium</span> Kami
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto"
            >
              Setiap pakaian diperlakukan khusus dengan deterjen premium dan teknologi modern.
            </motion.p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-brand-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center text-3xl ${service.color} mb-8 shadow-inner`}>
                  <service.icon />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-3 grayscale group-hover:grayscale-0 transition-all">
                  {service.name}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">
                  {service.desc}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-xl font-black text-brand-primary">
                    {service.price}
                  </span>
                  <Link 
                    href="/register" 
                    className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300"
                  >
                    <span className="w-5 h-5 flex items-center justify-center"><HiOutlineArrowRight /></span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            
            <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] relative z-10">
              Siap Mencoba Mahira?
            </h2>
            <p className="mt-6 text-xl text-white/70 relative z-10 max-w-xl mx-auto">
              Daftar sekarang dan klaim <span className="text-brand-accent font-bold">Diskon 10%</span> untuk order pertama. Masukkan kode <span className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent rounded font-mono">MAHIRA10</span>.
            </p>
            
            <div className="mt-12 flex flex-wrap justify-center gap-4 relative z-10">
              <Link
                href="/register"
                className="px-10 py-5 bg-brand-primary text-white rounded-full font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 text-lg flex items-center gap-3"
              >
                Daftar Sekarang
                <span className="w-6 h-6 flex items-center justify-center"><HiOutlineArrowRight /></span>
              </Link>
              <a
                href={`https://wa.me/${OUTLET_SALEMBA.whatsapp}?text=Halo Mahira Laundry, saya ingin order laundry`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-black hover:bg-white hover:text-slate-900 transition-all text-lg flex items-center gap-3"
              >
                <span className="w-6 h-6 flex items-center justify-center text-emerald-400 group-hover:text-slate-900 transition-colors"><FaWhatsapp /></span>
                Hubungi Kami
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
