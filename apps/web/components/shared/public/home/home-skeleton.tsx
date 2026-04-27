import { Skeleton } from "@/components/shared/common/skeleton";

export function HomeSkeleton() {
	return (
		<div className="w-full space-y-12 pb-20">
			{/* Hero Skeleton */}
			<section className="relative h-[600px] flex items-center justify-center bg-muted/30 overflow-hidden">
				<div className="container px-4 grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-4/5" />
						<Skeleton className="h-6 w-3/4" />
						<div className="flex gap-4 pt-4">
							<Skeleton className="h-12 w-40 rounded-full" />
							<Skeleton className="h-12 w-40 rounded-full" />
						</div>
					</div>
					<div className="hidden lg:block relative h-[450px]">
						<Skeleton className="absolute inset-0 rounded-3xl" />
					</div>
				</div>
				{/* Background shimmer effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
			</section>

			{/* Stats Skeleton */}
			<section className="container px-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
						<div key={i} className="flex flex-col items-center gap-2">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			</section>

			{/* Services Skeleton */}
			<section className="container px-4 space-y-10">
				<div className="text-center space-y-4 max-w-2xl mx-auto">
					<Skeleton className="h-4 w-32 mx-auto" />
					<Skeleton className="h-10 w-full mx-auto" />
					<Skeleton className="h-6 w-3/4 mx-auto" />
				</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
						<div
							key={i}
							className="rounded-2xl border border-border p-6 space-y-4"
						>
							<Skeleton className="h-48 w-full rounded-xl" />
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-10 w-full rounded-lg mt-4" />
						</div>
					))}
				</div>
			</section>

			{/* Gallery Skeleton */}
			<section className="bg-muted/30 py-20">
				<div className="container px-4 space-y-10">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
						<div className="space-y-4">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-64" />
						</div>
						<Skeleton className="h-10 w-32" />
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
							<Skeleton key={i} className="aspect-square rounded-xl" />
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Skeleton */}
			<section className="container px-4 py-20 space-y-10">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-64 mx-auto" />
				</div>
				<div className="grid md:grid-cols-3 gap-8">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
						<div
							key={i}
							className="p-8 rounded-2xl bg-white border border-border space-y-4"
						>
							<div className="flex gap-1">
								{Array.from({ length: 5 }).map((_, j) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
									<Skeleton key={j} className="h-4 w-4 rounded-full" />
								))}
							</div>
							<Skeleton className="h-20 w-full" />
							<div className="flex items-center gap-4 pt-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
