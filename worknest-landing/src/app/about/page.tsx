import Navbar from '@/components/Navbar';
import AboutHero from '@/components/about/AboutHero';
import Footer from '@/components/Footer';
import OurStory from '@/components/about/OurStory';

export const metadata = {
  title: "About GhostNet - Our Haunting Tale & Cursed Mission",
  description: "Learn about GhostNet's journey to transform the supernatural realm with AI-powered spectral solutions. Meet our phantom team and discover our dark values.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <AboutHero />
      <OurStory />
      <Footer />
    </div>
  );
}