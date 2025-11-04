import Navbar from '@/components/Navbar';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Contact WorkNest - Get in Touch",
  description: "Have questions about WorkNest? Want to collaborate or provide feedback? Reach out to our team directly.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ContactSection />
      <Footer />
    </div>
  );
}