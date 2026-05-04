import type { Metadata } from "next";
import { HiOutlineStar } from "react-icons/hi2";
import { TestimonialForm } from "@/components/shared/public/testimonial-form";

export const metadata: Metadata = {
	title: "Kirim Testimoni | Mahira Laundry",
	description: "Bagikan pengalaman Anda bersama Mahira Laundry.",
};

export default function PublicTestimonialPage() {
	return (
		<div className="py-20 sm:py-24 bg-slate-50 relative min-h-screen">
			{/* Background Deco */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
				<div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[120px]" />
				<div className="absolute bottom-1/4 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[120px]" />
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-12">
				<div className="bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
					<div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] -mr-32 -mt-32" />
					<div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/10 blur-[80px] -ml-24 -mb-24" />

					<div className="relative z-10 max-w-2xl">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 split-border-none">
							<span className="animate-pulse flex items-center justify-center">
								<HiOutlineStar size={14} />
							</span>
							<span>Kirim Testimoni</span>
						</div>
						<h1 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] mb-6 leading-tight">
							Bagikan Pengalaman <br />
							<span className="text-brand-accent">Sultan Anda</span>
						</h1>
						<p className="text-white/60 text-base sm:text-lg font-medium leading-relaxed">
							Bagikan pengalaman jujur Anda tentang layanan kami untuk membantu kami terus berkembang dan memberikan yang terbaik.
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-2xl mx-auto px-4 sm:px-6">
				<TestimonialForm showGuestName={true} />
			</div>
		</div>
	);
}
