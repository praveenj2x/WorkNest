"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading first
      gsap.fromTo(
        ".features-heading",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ".features-heading",
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate cards with stagger
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { 
              opacity: 0, 
              y: 60,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: "Easy Onboarding",
      description: "Welcome new hires with streamlined digital onboarding that guides them through every step, from paperwork to first-day setup.",
      image: "images/office.png"
    },
    {
      title: "Easy Management",
      description: "Manage your entire workforce from one intuitive dashboard. Track performance, schedules, and team dynamics effortlessly.",
      image: "images/managemnt.png"
    },
    {
      title: "Easy Review Process",
      description: "Conduct meaningful performance reviews with AI-powered insights, goal tracking, and automated feedback collection.",
      image: "images/review.png"
    },
    {
      title: "Better Analytics",
      description: "Make data-driven decisions with comprehensive workforce analytics, predictive insights, and customizable reporting.",
      image: "images/analytics.png"
    }
  ];

  return (
    <section ref={sectionRef} className="bg-[#F5F1DC]" style={{ willChange: 'transform', marginTop: '-0.5px' }}>
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32">
        {/* Heading */}
        <div className="mb-16 md:mb-24">
          <h2 className="features-heading sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight max-w-4xl">
            WorkNest meets HR teams where they are.
          </h2>
        </div>

        {/* Grid Container - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => { 
                cardsRef.current[index] = el; 
              }}
              className="group"
              style={{ willChange: 'transform' }}
            >
              {/* Image */}
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-[280px] md:h-[320px] lg:h-[360px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3 className="sorts-mill-goudy-regular text-xl md:text-2xl text-[#001BB7] mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="funnel-sans-regular text-sm md:text-base text-[#001BB7]/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}