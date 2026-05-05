"use client";

import { usePathname } from "next/navigation";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div
			key={pathname}
			className="animate-in fade-in duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
		>
			{children}
		</div>
	);
}
