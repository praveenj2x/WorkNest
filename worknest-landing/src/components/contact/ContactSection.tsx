"use client";
import { motion } from 'framer-motion';

export default function ContactSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const contactOptions = [
    {
      title: "General Inquiries",
      description: "Questions about WorkNest or want to learn more?",
      email: "hello@worknest.dev"
    },
    {
      title: "Feedback & Ideas",
      description: "Share your thoughts on our hackathon project",
      email: "feedback@worknest.dev"
    },
    {
      title: "Collaboration",
      description: "Interested in working together or joining our team?",
      email: "team@worknest.dev"
    },
    {
      title: "Technical Support",
      description: "Need help or found a bug in our demo?",
      email: "support@worknest.dev"
    }
  ];

  return (
    <section className="min-h-screen bg-[#F5F1DC] flex items-center">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32 w-full">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
            <h1 className="sorts-mill-goudy-regular text-6xl md:text-7xl lg:text-8xl text-[#001BB7] leading-tight mb-6">
              Let's Connect
            </h1>
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#001BB7]/80 max-w-3xl mx-auto leading-relaxed">
              WorkNest is a hackathon project with big dreams. We'd love to hear from you, 
              whether you have questions, feedback, or want to collaborate.
            </p>
          </motion.div>

          {/* Contact Options Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16"
            variants={containerVariants}
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-[#001BB7]/5 hover:shadow-lg transition-all duration-300"
              >

                <h3 className="sorts-mill-goudy-regular text-2xl md:text-3xl text-[#001BB7] mb-3">
                  {option.title}
                </h3>
                <p className="funnel-sans-regular text-[#001BB7]/70 mb-6 leading-relaxed">
                  {option.description}
                </p>
                <motion.a
                  href={`mailto:${option.email}?subject=Hello from WorkNest Website`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#001BB7] text-white funnel-sans-medium rounded-full hover:bg-[#0046FF] transition-colors duration-300"
                >
                  <span>Email Us</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-white rounded-2xl p-8 md:p-10 max-w-4xl mx-auto">
              <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-4">
                Built During a Hackathon
              </h3>
              <p className="funnel-sans-regular text-lg text-[#001BB7]/80 leading-relaxed">
                WorkNest started as a hackathon project with the goal of reimagining HR technology. 
                We're excited about the potential and would love to connect with fellow innovators, 
                HR professionals, and anyone interested in the future of work.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}