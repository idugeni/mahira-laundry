import { MahiraFooter } from "@/components/brand/mahira-footer";
import { MahiraHeader } from "@/components/brand/mahira-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MahiraHeader />
      <main className="flex-1">{children}</main>
      <MahiraFooter />
    </>
  );
}
