"use client";

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { formatCompact } from "@/lib/utils";

// ─── Revenue Bar Chart ─────────────────────────────────────────────────
interface RevenueChartProps {
	data: { month: string; revenue: number }[];
}

export function RevenueBarChart({ data }: RevenueChartProps) {
	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active?: boolean;
		payload?: { value: number; name: string }[];
		label?: string;
	}) => {
		if (active && payload?.length) {
			return (
				<div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg">
					<p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
					<p className="text-lg font-black text-pink-600">
						{formatCompact(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div style={{ width: "100%", height: "100%", minHeight: 200, minWidth: 0 }}>
			<ResponsiveContainer
				width="100%"
				height="100%"
				minWidth={0}
				minHeight={200}
			>
				<BarChart
					data={data}
					margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
				>
					<defs>
						<linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
							<stop offset="100%" stopColor="#f43f5e" stopOpacity={0.6} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="#f1f5f9"
						vertical={false}
					/>
					<XAxis
						dataKey="month"
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
						tickFormatter={(v) => formatCompact(v)}
					/>
					<Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
					<Bar
						dataKey="revenue"
						fill="url(#revenueGrad)"
						radius={[6, 6, 0, 0]}
						maxBarSize={48}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

// ─── Order Trend Line Chart ─────────────────────────────────────────────
interface OrderTrendChartProps {
	data: { day: string; count: number }[];
}

export function OrderTrendChart({ data }: OrderTrendChartProps) {
	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active?: boolean;
		payload?: { value: number; name: string }[];
		label?: string;
	}) => {
		if (active && payload?.length) {
			return (
				<div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg">
					<p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
					<p className="text-lg font-black text-indigo-600">
						{payload[0].value} order
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div style={{ width: "100%", height: "100%", minHeight: 200, minWidth: 0 }}>
			<ResponsiveContainer
				width="100%"
				height="100%"
				minWidth={0}
				minHeight={200}
			>
				<AreaChart
					data={data}
					margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
				>
					<defs>
						<linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
							<stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="#f1f5f9"
						vertical={false}
					/>
					<XAxis
						dataKey="day"
						tick={{ fontSize: 10, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
						interval={Math.floor(data.length / 7)}
					/>
					<YAxis
						tick={{ fontSize: 10, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
						allowDecimals={false}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Area
						type="monotone"
						dataKey="count"
						stroke="#6366f1"
						strokeWidth={2.5}
						fill="url(#orderGrad)"
						dot={false}
						activeDot={{ r: 5, fill: "#6366f1" }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

// ─── Payment Method Pie Chart ────────────────────────────────────────────
const PAYMENT_COLORS: Record<string, string> = {
	cash: "#10b981",
	qris: "#6366f1",
	bank_transfer: "#3b82f6",
	gopay: "#06b6d4",
	ovo: "#8b5cf6",
	dana: "#f59e0b",
	shopeepay: "#ef4444",
	other: "#94a3b8",
};

const PAYMENT_LABELS: Record<string, string> = {
	cash: "Tunai",
	qris: "QRIS",
	bank_transfer: "Transfer",
	gopay: "GoPay",
	ovo: "OVO",
	dana: "DANA",
	shopeepay: "ShopeePay",
	other: "Lainnya",
};

interface PaymentPieChartProps {
	data: { method: string; total: number }[];
}

export function PaymentPieChart({ data }: PaymentPieChartProps) {
	const CustomTooltip = ({
		active,
		payload,
	}: {
		active?: boolean;
		payload?: { value: number; name: string }[];
	}) => {
		if (active && payload?.length) {
			const { name, value } = payload[0];
			return (
				<div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg">
					<p className="text-xs font-semibold text-slate-500 mb-1">
						{PAYMENT_LABELS[name] || name}
					</p>
					<p className="text-base font-black text-slate-900">
						{formatCompact(value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div style={{ width: "100%", height: "100%", minHeight: 200, minWidth: 0 }}>
			<ResponsiveContainer
				width="100%"
				height="100%"
				minWidth={0}
				minHeight={200}
			>
				<PieChart>
					<Pie
						data={data}
						dataKey="total"
						nameKey="method"
						cx="50%"
						cy="50%"
						innerRadius="55%"
						outerRadius="80%"
						paddingAngle={3}
					>
						{data.map((entry) => (
							<Cell
								key={entry.method}
								fill={PAYMENT_COLORS[entry.method] || "#94a3b8"}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
					<Legend
						formatter={(value: string) => (
							<span className="text-xs text-slate-600">
								{PAYMENT_LABELS[value] || value}
							</span>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
