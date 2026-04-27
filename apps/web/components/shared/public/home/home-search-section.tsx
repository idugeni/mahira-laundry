"use client";

import { motion } from "motion/react";
import { ServiceSearch } from "@/components/shared/public/service-search";

export function HomeSearchSection() {
	return (
		<section className="relative -mt-24 pb-12 z-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				>
					<div className="text-center mb-8">
						<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
							Cari Layanan Kami
						</p>
						<h2 className="text-2xl font-black text-slate-900">
							Apa yang bisa kami{" "}
							<span className="text-brand-primary">bantu</span> hari ini?
						</h2>
					</div>

					<ServiceSearch variant="section" className="relative z-10" />
				</motion.div>
			</div>
		</section>
	);
}
