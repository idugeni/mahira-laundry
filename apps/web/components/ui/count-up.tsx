"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
	to: number;
	duration?: number;
	delay?: number;
	decimal?: number;
	suffix?: string;
	prefix?: string;
	className?: string;
}

export function CountUp({
	to,
	duration = 2,
	delay = 0,
	decimal = 0,
	suffix = "",
	prefix = "",
	className,
}: CountUpProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: false, margin: "-100px" });
	const [display, setDisplay] = useState("0");
	const hasAnimated = useRef(false);

	useEffect(() => {
		if (!isInView) {
			hasAnimated.current = false;
			setDisplay(prefix + (0).toFixed(decimal) + suffix);
			return;
		}

		if (hasAnimated.current) return;
		hasAnimated.current = true;

		const startTime = performance.now() + delay * 1000;
		const durationMs = duration * 1000;

		const step = (now: number) => {
			const elapsed = now - startTime;
			if (elapsed < 0) {
				requestAnimationFrame(step);
				return;
			}

			const progress = Math.min(elapsed / durationMs, 1);
			// Ease out expo for satisfying deceleration
			const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
			const current = eased * to;

			setDisplay(prefix + current.toFixed(decimal) + suffix);

			if (progress < 1) {
				requestAnimationFrame(step);
			}
		};

		requestAnimationFrame(step);
	}, [isInView, to, duration, delay, decimal, suffix, prefix]);

	return (
		<motion.span
			ref={ref}
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: false }}
			transition={{ duration: 0.4, delay }}
			className={className}
		>
			{display}
		</motion.span>
	);
}
