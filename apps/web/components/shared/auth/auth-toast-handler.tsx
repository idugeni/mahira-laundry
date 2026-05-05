"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

function ToastHandler() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const toastType = searchParams.get("toast");
		if (toastType === "welcome") {
			toast.success("Selamat Datang Kembali!", {
				description: "Anda berhasil masuk ke dashboard Mahira Laundry.",
			});
		} else if (toastType === "registered") {
			toast.success("Pendaftaran Berhasil!", {
				description: "Selamat bergabung di keluarga Mahira Laundry.",
			});
		}
	}, [searchParams]);

	return null;
}

export function AuthToastHandler() {
	return (
		<Suspense fallback={null}>
			<ToastHandler />
		</Suspense>
	);
}
