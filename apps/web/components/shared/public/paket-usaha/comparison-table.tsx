import type { BusinessPackage } from "@/lib/types";

interface ComparisonTableProps {
	packages: BusinessPackage[];
}

const formatIDR = (amount: number) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);

function getEffectivePrice(pkg: BusinessPackage): number {
	const promoActive =
		pkg.promo_price != null &&
		pkg.promo_expires_at != null &&
		new Date(pkg.promo_expires_at) > new Date();
	return promoActive ? (pkg.promo_price as number) : pkg.price;
}

const rows: { label: string; getValue: (pkg: BusinessPackage) => string }[] = [
	{ label: "Tier", getValue: (pkg) => pkg.tier },
	{ label: "Harga", getValue: (pkg) => formatIDR(getEffectivePrice(pkg)) },
	{
		label: "Jumlah Item",
		getValue: (pkg) => `${pkg.items.length} item`,
	},
	{
		label: "Durasi Training",
		getValue: (pkg) =>
			pkg.training_duration_days ? `${pkg.training_duration_days} hari` : "-",
	},
	{
		label: "Cakupan Support",
		getValue: (pkg) => pkg.support_coverage ?? "-",
	},
	{
		label: "Estimasi ROI",
		getValue: (pkg) => pkg.estimated_roi ?? "-",
	},
];

export default function ComparisonTable({ packages }: ComparisonTableProps) {
	if (packages.length === 0) return null;

	return (
		<div className="w-full overflow-x-auto">
			<table className="min-w-full border-collapse text-sm">
				<thead>
					<tr>
						<th className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-semibold text-gray-500 border-b border-gray-200 min-w-[140px]">
							Fitur
						</th>
						{packages.map((pkg) => (
							<th
								key={pkg.id}
								className="px-4 py-3 text-center font-semibold text-gray-800 border-b border-gray-200 min-w-[160px]"
							>
								{pkg.name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr
							key={row.label}
							className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
						>
							<td className="sticky left-0 z-10 px-4 py-3 font-medium text-gray-600 border-b border-gray-100 bg-inherit">
								{row.label}
							</td>
							{packages.map((pkg) => (
								<td
									key={pkg.id}
									className="px-4 py-3 text-center text-gray-700 border-b border-gray-100"
								>
									{row.getValue(pkg)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
