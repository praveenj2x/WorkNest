"use client";
import { motion } from 'framer-motion';

export default function PrivacyContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight mb-6">
              Privacy Policy
            </h1>
            <p className="funnel-sans-regular text-lg text-[#001BB7]/70">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Hackathon Notice */}
          <motion.div variants={itemVariants} className="bg-[#F5F1DC] rounded-2xl p-8 mb-12">
            <h3 className="sorts-mill-goudy-regular text-2xl text-[#001BB7] mb-3">
              Hackathon Project Notice
            </h3>
            <p className="funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
              WorkNest is currently a hackathon project and prototype. We are not yet collecting, 
              processing, or storing any personal data from users. This privacy policy outlines 
              our intended practices for when we develop a full platform.
            </p>
          </motion.div>

          {/* Privacy Content */}
          <div className="space-y-12">
            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Our Commitment to Privacy
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  At WorkNest, we believe privacy is a fundamental right. As we develop our HR platform, 
                  we are committed to building privacy and security into every aspect of our system from day one.
                </p>
                <p>
                  This policy explains how we intend to handle data when our platform becomes operational, 
                  and our current practices during the development phase.
                </p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Current Data Collection (Hackathon Phase)
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  <strong>Website Analytics:</strong> We may use basic analytics to understand how visitors 
                  interact with our website. This helps us improve the user experience.
                </p>
                <p>
                  <strong>Contact Information:</strong> If you contact us via email, we store your email 
                  address and message content solely to respond to your inquiry.
                </p>
                <p>
                  <strong>No User Accounts:</strong> We currently do not offer user registration or accounts, 
                  so we do not collect personal profile information.
                </p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Future Platform Practices
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  When WorkNest becomes a fully operational HR platform, we plan to implement these practices:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Data Minimization:</strong> We will only collect data that is necessary for our services</li>
                  <li><strong>Encryption:</strong> All sensitive data will be encrypted in transit and at rest</li>
                  <li><strong>User Control:</strong> Users will have full control over their data, including deletion rights</li>
                  <li><strong>Transparency:</strong> Clear explanations of what data we collect and why</li>
                  <li><strong>No Data Selling:</strong> We will never sell user data to third parties</li>
                </ul>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Security Measures
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  Even in our current prototype phase, we take security seriously:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Secure hosting with HTTPS encryption</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access to any collected data</li>
                  <li>Plans for comprehensive security audits before launch</li>
                </ul>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Your Rights
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  Even during our development phase, you have rights regarding any information we may have:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Right to know what information we have about you</li>
                  <li>Right to request deletion of your information</li>
                  <li>Right to correct any inaccurate information</li>
                  <li>Right to opt-out of any communications</li>
                </ul>
                <p>
                  To exercise these rights, simply contact us at privacy@worknest.dev
                </p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Changes to This Policy
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  As WorkNest evolves from a hackathon project to a full platform, this privacy policy 
                  will be updated to reflect our actual practices. We will notify users of any significant 
                  changes and always maintain our commitment to privacy and transparency.
                </p>
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                Contact Us
              </h2>
              <div className="space-y-4 funnel-sans-regular text-[#001BB7]/80 leading-relaxed">
                <p>
                  If you have any questions about this privacy policy or our data practices, 
                  please don't hesitate to reach out:
                </p>
                <div className="bg-[#F5F1DC] rounded-lg p-6">
                  <p><strong>Email:</strong> privacy@worknest.dev</p>
                  <p><strong>General Inquiries:</strong> hello@worknest.dev</p>
                </div>
                <p>
                  We're committed to addressing any concerns and being transparent about our practices 
                  as we build WorkNest.
                </p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </section>
  );
}