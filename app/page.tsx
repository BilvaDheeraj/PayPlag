import { Header } from '@/components/shared/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import { ToolsShowcase } from '@/components/sections/ToolsShowcase'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { LiveDemo } from '@/components/sections/LiveDemo'
import { TrustProof } from '@/components/sections/TrustProof'
import { FeatureDeepDives } from '@/components/sections/FeatureDeepDives'
import { PricingSection } from '@/components/sections/PricingSection'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection, Footer } from '@/components/sections/CTAAndFooter'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ToolsShowcase />
        <HowItWorks />
        <LiveDemo />
        <TrustProof />
        <FeatureDeepDives />
        <PricingSection />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
