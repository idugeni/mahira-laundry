import { MahiraSpinner } from "@/components/shared/mahira-spinner";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <MahiraSpinner size="lg" />
    </div>
  );
}
