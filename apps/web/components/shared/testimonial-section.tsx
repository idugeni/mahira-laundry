"use client";

import { motion } from "motion/react";
import { HiStar } from "react-icons/hi2";

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  profiles: {
    full_name: string;
  };
}

export interface TestimonialData {
  id: string;
  content: string;
  rating: number;
  profiles?: {
    full_name?: string;
  };
}

interface TestimonialSectionProps {
  testimonials: TestimonialData[];
}

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  {
    id: "default-1",
    content:
      "Layanan Mahira sangat luar biasa! Cucian bersih, wangi, dan antar-jemputnya sangat tepat waktu. Sangat merekomendasikan layanan Express 6 jamnya.",
    rating: 5,
    profiles: { full_name: "Budi Santoso" },
  },
  {
    id: "default-2",
    content:
      "Baru kali ini ketemu laundry yang seprofesional ini di Jakarta. Dashboard pelanggannya keren banget, bisa track order secara real-time. Mantap!",
    rating: 5,
    profiles: { full_name: "Siti Aminah" },
  },
  {
    id: "default-3",
    content:
      "Aplikasi yang sangat membantu buat saya yang sibuk. Tinggal klik-klik di web, kurir datang jemput. Hasil cuciannya rapi banget!",
    rating: 5,
    profiles: { full_name: "Andi Wijaya" },
  },
];

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-4 block">
              Social Proof
            </span>
            <h2 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
              Apa Kata{" "}
              <span className="text-brand-gradient">Pelanggan Mahira?</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50/50 p-8 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-brand-primary/5 transition-all group"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= t.rating ? "text-amber-400" : "text-slate-200"
                    }
                  >
                    <HiStar size={20} />
                  </span>
                ))}
              </div>

              <blockquote className="text-lg font-medium text-slate-700 italic leading-relaxed mb-8">
                "{t.content}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-primary/20">
                  {t.profiles?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-black text-slate-900 leading-none">
                    {t.profiles?.full_name || "Pelanggan Setia"}
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Verified Customer
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
