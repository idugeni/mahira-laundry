import type { Metadata } from "next";
import { HiOutlineStar } from "react-icons/hi2";
import { TestimonialForm } from "@/components/shared/testimonial-form";

export const metadata: Metadata = {
	title: "Kirim Testimoni",
	description: "Bagikan pengalaman Sultan Anda bersama Mahira Laundry.",
};

export default function TestimonialPage() {
	return (
		<div className="space-y-8">
			<div className="bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
				<div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] -mr-32 -mt-32" />
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/10 blur-[80px] -ml-24 -mb-24" />

				<div className="relative z-10 max-w-2xl">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 split-border-none">
						<span className="animate-pulse flex items-center justify-center">
							<HiOutlineStar size={14} />
						</span>
						<span>Suara Sultan Mahira</span>
					</div>
					<h1 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] mb-6 leading-tight">
						Bagikan Pengalaman{" "}
						<span className="text-brand-accent">Sultan Anda</span>
					</h1>
					<p className="text-white/60 text-lg font-medium leading-relaxed">
						Kepuasan Anda adalah prioritas utama kami. Bantu kami memberikan
						layanan yang lebih baik dengan membagikan ulasan jujur Anda.
					</p>
				</div>
			</div>

			<div className="max-w-2xl mx-auto">
				<TestimonialForm />
			</div>
		</div>
	);
}
