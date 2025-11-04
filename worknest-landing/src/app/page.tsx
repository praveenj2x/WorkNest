import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Placeholder sections for scroll testing */}
      <section id="features" className="bg-gray-50 section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <h2 className="sorts-mill-goudy-regular text-4xl text-gray-900 mb-4">Features</h2>
            <p className="funnel-sans-regular text-lg text-gray-600">Coming soon...</p>
          </div>
        </div>
      </section>
      
      <section id="about" className="bg-white section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <h2 className="sorts-mill-goudy-regular text-4xl text-gray-900 mb-4">About</h2>
            <p className="funnel-sans-regular text-lg text-gray-600">Coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
