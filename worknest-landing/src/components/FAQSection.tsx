"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// FAQ Section Component
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate FAQ items
      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ".faq-container",
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const faqs = [
    {
      question: "What is WorkNest?",
      answer: "WorkNest is a modern HR management platform designed to help organizations better manage their human resources processes. We're building tools to make HR tasks more efficient and user-friendly."
    },
    {
      question: "What features are you planning to offer?",
      answer: "We're developing features for employee onboarding, performance management, and workforce analytics. Our goal is to create intuitive tools that simplify common HR workflows."
    },
    {
      question: "Is WorkNest available now?",
      answer: "We're currently in development and building our platform. We're working hard to create a solution that truly meets the needs of HR professionals and their teams."
    },
    {
      question: "How can I stay updated on your progress?",
      answer: "You can sign up for our newsletter or follow our updates to be notified when we launch. We'll share our progress and let you know when the platform becomes available."
    },
    {
      question: "What makes WorkNest different?",
      answer: "We're focused on creating a user-friendly experience that puts people first. Our approach emphasizes simplicity and effectiveness rather than overwhelming features."
    },
    {
      question: "When will WorkNest be available?",
      answer: "We're working diligently on development, but we don't have a specific launch date yet. We want to ensure we build something truly valuable before releasing it to the public."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="bg-[#F5F1DC] py-20 md:py-32" style={{ willChange: 'transform', marginTop: '-0.5px' }} id="faq">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Section Title */}
        <div ref={titleRef} className="mb-16 md:mb-20">
          <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item border-b border-[#001BB7]/20 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 md:py-8 flex items-start justify-between gap-4 text-left group outline-none transition-colors duration-200"
              >
                <h3 className="sorts-mill-goudy-regular text-2xl md:text-3xl lg:text-4xl text-[#001BB7] transition-colors group-hover:text-[#0046FF]">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 mt-2"
                >
                  <svg
                    className={`w-8 h-8 transition-colors duration-300 ${
                      openIndex === index ? 'text-[#FF8040]' : 'text-[#0046FF]'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="funnel-sans-regular text-lg md:text-xl text-[#001BB7]/80 leading-relaxed pb-8 pr-12">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FAQSection;