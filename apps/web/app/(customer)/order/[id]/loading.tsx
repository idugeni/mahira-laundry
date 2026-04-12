import { CardSkeleton } from "@/components/shared/skeleton";
export default function OrderDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
