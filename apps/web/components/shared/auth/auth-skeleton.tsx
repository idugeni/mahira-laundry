import { Skeleton } from "@/components/shared/common/skeleton";

export function AuthSkeleton() {
	return (
		<div className="h-screen w-full flex bg-slate-50 overflow-hidden">
			{/* Left Side Skeleton */}
			<div className="flex-1 flex flex-col h-full relative z-20 overflow-hidden p-4 lg:p-8">
				<div className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col overflow-hidden my-auto max-h-[95vh]">
					{/* Header Skeleton */}
					<div className="p-8 pb-4 text-center space-y-4">
						<Skeleton className="h-6 w-32 mx-auto rounded-full" />
						<Skeleton className="h-12 w-3/4 mx-auto" />
						<Skeleton className="h-4 w-full mx-auto" />
					</div>

					{/* Form Skeleton */}
					<div className="px-8 lg:px-10 py-6 space-y-4">
						<Skeleton className="h-12 w-full rounded-[1.2rem]" />
						<Skeleton className="h-12 w-full rounded-[1.2rem]" />
						<Skeleton className="h-4 w-24 ml-auto" />
						<Skeleton className="h-14 w-full rounded-[1.2rem] mt-6" />
						<div className="relative py-4">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-100" />
							</div>
							<Skeleton className="h-4 w-20 mx-auto bg-white z-10" />
						</div>
						<Skeleton className="h-12 w-full rounded-[1.2rem]" />
					</div>

					{/* Footer Skeleton */}
					<div className="p-8 space-y-4 text-center">
						<Skeleton className="h-4 w-3/4 mx-auto" />
						<Skeleton className="h-4 w-1/2 mx-auto" />
					</div>
				</div>
			</div>

			{/* Right Side Skeleton (Matching the split layout) */}
			<div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-slate-900 h-full">
				<div className="absolute inset-0 flex flex-col justify-between p-16 lg:p-20">
					<Skeleton className="h-20 w-64 bg-white/5" />
					<div className="space-y-6">
						<Skeleton className="h-1 w-16 bg-brand-accent/20" />
						<Skeleton className="h-24 w-3/4 bg-white/5" />
						<Skeleton className="h-6 w-1/2 bg-white/5" />
					</div>
				</div>
				{/* Floating items placeholder */}
				<div className="absolute top-[25%] right-[12%]">
					<Skeleton className="h-20 w-48 bg-white/5 rounded-3xl" />
				</div>
				<div className="absolute bottom-[25%] right-[18%]">
					<Skeleton className="h-20 w-48 bg-white/5 rounded-3xl" />
				</div>
			</div>
		</div>
	);
}
