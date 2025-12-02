"use client";
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import MissionSection from '@/components/MissionSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection/>
      <MissionSection/>
      <PricingSection/>
      <FAQSection/>
      <Footer/>
    </div>
  );
}
