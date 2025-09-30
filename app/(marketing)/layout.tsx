import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeroHeader />
      {children}
      <FooterSection />
    </>
  );
}
