"use client";

import { motion } from "motion/react";
import { UniversalSearch } from "@/components/shared/public/universal-search";

export function HomeSearchSection() {
	return (
		<section className="relative -mt-8 pb-12 lg:-mt-12 lg:pb-16 z-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				>
					<UniversalSearch variant="section" className="relative z-10" />
				</motion.div>
			</div>
		</section>
	);
}
