import Navbar from '@/components/Navbar';
import AboutHero from '@/components/about/AboutHero';
import Footer from '@/components/Footer';
import OurStory from '@/components/about/OurStory';

export const metadata = {
  title: "About WorkNest - Our Story & Mission",
  description: "Learn about WorkNest's journey to transform HR management with AI-powered solutions. Meet our team and discover our values.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AboutHero />
      <OurStory />
      <Footer />
    </div>
  );
}