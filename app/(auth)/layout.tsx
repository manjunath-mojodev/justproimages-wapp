import { SimpleHeader } from "@/components/simple-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SimpleHeader />
      <div className="pt-20">{children}</div>
    </>
  );
}
