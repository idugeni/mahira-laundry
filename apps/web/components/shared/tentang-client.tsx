"use client";

import { motion } from "motion/react";
import { HiOutlineSparkles, HiOutlineRocketLaunch, HiOutlineCheckBadge, HiOutlineMapPin, HiOutlineTruck, HiOutlineClock, HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { MdOutlineScience } from "react-icons/md";

export function TentangClient() {
  return (
    <div className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-bold mb-6"
          >
            <span className="w-4 h-4"><HiOutlineSparkles /></span>
            <span>Mahira Story</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black font-[family-name:var(--font-heading)] text-slate-900"
          >
            Tentang <span className="inline-block text-brand-gradient">Mahira Laundry</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Didirikan oleh <strong className="text-slate-900">Indira Maharani</strong>, Mahira Laundry lahir dari visi sederhana: memberikan standar kebersihan laundry premium tanpa kompromi.
          </motion.p>
        </div>

        <div className="grid gap-16">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 text-6xl text-slate-200 opacity-20 pointer-events-none">
                <HiOutlineRocketLaunch />
            </div>
            <h2 className="text-2xl font-black font-[family-name:var(--font-heading)] mb-6 text-slate-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-brand-primary rounded-full" />
              Visi Kami
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Menjadi layanan laundry terpercaya nomor satu di Jakarta dengan
              standar kebersihan internasional dan pelayanan pelanggan yang luar
              biasa. Kami berkomitmen untuk memberikan perawatan terbaik untuk
              setiap helai pakaian.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] border border-slate-100"
          >
            <h2 className="text-2xl font-black font-[family-name:var(--font-heading)] mb-8 text-slate-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-brand-accent rounded-full" />
              Misi Kami
            </h2>
            <div className="grid gap-6">
              {[
                "Memberikan layanan laundry dengan kualitas premium dan harga terjangkau",
                "Menggunakan deterjen ramah lingkungan dan teknologi modern",
                "Menyediakan layanan antar-jemput yang cepat dan terpercaya",
                "Membangun hubungan jangka panjang dengan setiap pelanggan"
              ].map((misi, i) => (
                <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center font-black shrink-0">
                    0{i+1}
                  </div>
                  <p className="text-slate-600 font-medium pt-1">{misi}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <section>
            <h2 className="text-2xl font-black font-[family-name:var(--font-heading)] mb-10 text-center text-slate-900">
              Kenapa Memilih Mahira?
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  icon: MdOutlineScience,
                  title: "Deterjen Premium",
                  desc: "Formula khusus yang aman untuk serat kain dan ramah lingkungan.",
                  color: "text-blue-500",
                  bg: "bg-blue-50"
                },
                {
                  icon: HiOutlineTruck,
                  title: "Antar Jemput Gratis",
                  desc: "Layanan pickup & delivery di area Salemba tanpa biaya tambahan.",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50"
                },
                {
                  icon: HiOutlineClock,
                  title: "Express 6 Jam",
                  desc: "Pakaian bersih seketika untuk jadwal Anda yang padat.",
                  color: "text-orange-500",
                  bg: "bg-orange-50"
                },
                {
                  icon: HiOutlineDevicePhoneMobile,
                  title: "Tracking Online",
                  desc: "Pantau status cucian Anda dari dashboard pelanggan secara real-time.",
                  color: "text-brand-primary",
                  bg: "bg-brand-primary/10"
                },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-start gap-6 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-3xl shrink-0 transition-transform group-hover:scale-110`}>
                    <item.icon />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
