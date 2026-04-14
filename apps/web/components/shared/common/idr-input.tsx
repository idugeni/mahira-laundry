"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";

interface IDRInputProps {
	value: number;
	onChange: (value: number) => void;
	placeholder?: string;
	className?: string;
	id?: string;
}

export function IDRInput({
	value,
	onChange,
	placeholder = "Rp 0",
	className = "",
	id,
}: IDRInputProps) {
	const [displayValue, setDisplayValue] = useState(
		value ? formatIDR(value) : "",
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/[^\d]/g, "");
		const num = parseInt(raw, 10) || 0;
		onChange(num);
		setDisplayValue(num ? formatIDR(num) : "");
	};

	return (
		<input
			id={id}
			type="text"
			value={displayValue}
			onChange={handleChange}
			placeholder={placeholder}
			className={`w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary ${className}`}
		/>
	);
}
