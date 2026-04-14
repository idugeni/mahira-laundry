"use client";

import { motion } from "motion/react";
import { HiOutlineArrowPath } from "react-icons/hi2";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="id">
			<body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 font-sans">
				<div className="text-center max-w-lg p-6">
					<motion.div
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: "spring", stiffness: 200 }}
					>
						<div className="w-28 h-28 rounded-3xl bg-red-100 flex items-center justify-center mx-auto shadow-lg shadow-red-100">
							<span className="text-6xl">🚨</span>
						</div>
					</motion.div>

					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="mt-8 text-2xl font-bold"
					>
						Terjadi Kesalahan Sistem
					</motion.h1>

					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="mt-3 text-gray-500"
					>
						Kami mengalami masalah teknis yang tidak terduga. Silakan coba muat
						ulang halaman.
					</motion.p>

					{error.digest && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.35 }}
							className="mt-4 text-xs text-gray-400 font-mono bg-gray-100 px-3 py-1.5 rounded-lg inline-block"
						>
							ID Error: {error.digest}
						</motion.p>
					)}

					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-8"
					>
						<button
							type="button"
							onClick={reset}
							className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
						>
							<span className="w-4 h-4 flex items-center justify-center">
								<HiOutlineArrowPath />
							</span>
							Muat Ulang
						</button>
					</motion.div>
				</div>
			</body>
		</html>
	);
}
