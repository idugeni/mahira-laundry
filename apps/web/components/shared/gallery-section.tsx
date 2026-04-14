"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import { HiOutlinePhoto, HiOutlineViewColumns } from "react-icons/hi2";

const categories = ["Semua", "Hasil Cucian", "Fasilitas", "Proses", "Lainnya"];

import { GalleryItem } from "@/lib/types";

export function GallerySection({ items = [] }: { items?: GalleryItem[] }) {
  const [filter, setFilter] = useState("Semua");

  const filteredItems = filter === "Semua" 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <span className="w-3 h-3 flex items-center justify-center">
                <HiOutlinePhoto />
              </span>
              <span>Galeri Mahira</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-tight"
            >
              Melihat Lebih Dekat <br />
              <span className="text-brand-gradient">Kualitas Kami</span>
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  filter === cat
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
              <span className="w-8 h-8 flex items-center justify-center">
                <HiOutlineViewColumns />
              </span>
            </div>
            <p className="text-slate-400 font-bold">Belum ada foto dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 cursor-zoom-in"
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">
                    {item.category || "Umum"}
                  </span>
                  <h3 className="text-white font-bold font-[family-name:var(--font-heading)] text-xl">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
