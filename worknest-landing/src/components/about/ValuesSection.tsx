"use client";
import { motion } from 'framer-motion';

export default function ValuesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const values = [
    {
      title: "People First",
      description: "Every decision we make starts with asking: how does this help people do their best work and feel valued?"
    },
    {
      title: "Simplicity",
      description: "Complex problems don't always need complex solutions. We believe in making powerful tools that are intuitive to use."
    },
    {
      title: "Transparency",
      description: "We're honest about where we are in our journey and what we're building. No false promises, just genuine progress."
    },
    {
      title: "Continuous Learning",
      description: "We listen to our users, learn from our mistakes, and constantly evolve to better serve the HR community."
    }
  ];

  return (
    <section className="bg-[#F5F1DC] py-20 md:py-32">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={cardVariants} className="text-center mb-16 md:mb-20">
            <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight mb-6">
              Our Values
            </h2>
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#001BB7]/70 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer relationships.
            </p>
          </motion.div>

          {/* Values Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-[#001BB7]/5 hover:shadow-lg transition-shadow duration-300"
              >

                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-4">
                  {value.title}
                </h3>
                <p className="funnel-sans-regular text-lg text-[#001BB7]/80 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}