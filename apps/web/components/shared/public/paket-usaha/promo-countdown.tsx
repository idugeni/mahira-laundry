"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

interface PromoCountdownProps {
	expiresAt: string;
}

function calculateTimeLeft(expiresAt: string): TimeLeft {
	const diff = new Date(expiresAt).getTime() - Date.now();
	if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

	return {
		days: Math.floor(diff / (1000 * 60 * 60 * 24)),
		hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((diff / (1000 * 60)) % 60),
		seconds: Math.floor((diff / 1000) % 60),
	};
}

export default function PromoCountdown({ expiresAt }: PromoCountdownProps) {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
		calculateTimeLeft(expiresAt),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calculateTimeLeft(expiresAt));
		}, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	const { days, hours, minutes, seconds } = timeLeft;
	if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) return null;

	return (
		<span>
			Berakhir dalam: {days}h {hours}j {minutes}m {seconds}d
		</span>
	);
}
