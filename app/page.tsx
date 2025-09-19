import CallToAction from "@/components/call-to-action";
import ContentSection from "@/components/content-2";
import Features from "@/components/features-3";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import IntegrationsSection from "@/components/integrations-7";
import StatsSection from "@/components/stats";

export default function Home() {
  return (
    <>
      <HeroSection></HeroSection>
      <Features></Features>
      <IntegrationsSection></IntegrationsSection>
      <ContentSection></ContentSection>
      <StatsSection></StatsSection>
      <CallToAction></CallToAction>
      <FooterSection></FooterSection>
    </>
  );
}
