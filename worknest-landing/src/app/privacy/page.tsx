import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PrivacyContent from '@/components/privacy/PrivacyContent';

export const metadata = {
  title: "Privacy Policy - WorkNest",
  description: "Learn how WorkNest handles data and privacy for our hackathon project and future platform development.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PrivacyContent />
      <Footer />
    </div>
  );
}