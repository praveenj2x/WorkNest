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
      question: "What is GhostNet? 👻",
      answer: "GhostNet is a supernatural productivity platform that channels spectral intelligence from beyond the veil. We're summoning tools to make your workflow hauntingly efficient and delightfully spooky."
    },
    {
      question: "What dark powers are you offering? 🔮",
      answer: "We're conjuring features for phantom onboarding, cursed performance reviews, and haunted workforce analytics. Our goal is to create mystical tools that bewitch common workflows with Halloween magic."
    },
    {
      question: "Is GhostNet available in this realm? 🎃",
      answer: "We're currently brewing our potion in the cauldron of development. The spirits are working tirelessly to manifest a solution that truly haunts the needs of supernatural professionals."
    },
    {
      question: "How can I receive messages from the beyond? 📮",
      answer: "You can summon our newsletter through a séance or follow our spectral updates to be notified when we emerge from the shadows. We'll share ghostly progress from the other side."
    },
    {
      question: "What makes GhostNet eerily different? 🦇",
      answer: "We're focused on creating a spine-chilling experience that puts phantoms first. Our approach emphasizes supernatural simplicity and bewitching effectiveness rather than overwhelming dark magic."
    },
    {
      question: "When will the spirits be unleashed? 🌙",
      answer: "We're working under the light of the full moon, but we don't have a specific witching hour yet. We want to ensure we summon something truly cursed before releasing it from the crypt."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#0a0a0a] to-[#1a0a1a] py-20 md:py-32 relative overflow-hidden" style={{ willChange: 'transform', marginTop: '-0.5px' }} id="faq">
      {/* Spooky background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 text-8xl">🕸️</div>
        <div className="absolute bottom-20 left-20 text-7xl">🦇</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="mb-16 md:mb-20">
          <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#ff6b35] leading-tight drop-shadow-[0_0_20px_rgba(255,107,53,0.3)]">
            Questions from the Crypt 🪦
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item border-b border-[#6a0dad]/30 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 md:py-8 flex items-start justify-between gap-4 text-left group outline-none transition-colors duration-200"
              >
                <h3 className="sorts-mill-goudy-regular text-2xl md:text-3xl lg:text-4xl text-[#ff6b35] transition-colors group-hover:text-[#ff8c00]">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 mt-2"
                >
                  <svg
                    className={`w-8 h-8 transition-colors duration-300 ${openIndex === index ? 'text-[#ff6b35]' : 'text-[#6a0dad]'
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
                    <p className="funnel-sans-regular text-lg md:text-xl text-[#ff8c00]/80 leading-relaxed pb-8 pr-12">
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