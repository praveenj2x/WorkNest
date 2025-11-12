"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              markers: false
            }
          }
        );
      }

      // Animate cards with stagger using batch
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll('.feature-card');
        
        gsap.fromTo(
          cards,
          { 
            opacity: 0, 
            y: 60,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
              markers: false
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      title: "Easy Onboarding",
      description: "Welcome new hires with streamlined digital onboarding that guides them through every step, from paperwork to first-day setup.",
      letter: "a",
      color: "#BF092F"
    },
    {
      title: "Easy Management",
      description: "Manage your entire workforce from one intuitive dashboard. Track performance, schedules, and team dynamics effortlessly.",
      letter: "i",
      color: "#FF6500"
    },
    {
      title: "Easy Review Process",
      description: "Conduct meaningful performance reviews with AI-powered insights, goal tracking, and automated feedback collection.",
      letter: "f",
      color: "#003161"
    },
    {
      title: "Better Analytics",
      description: "Make data-driven decisions with comprehensive workforce analytics, predictive insights, and customizable reporting.",
      letter: "p",
      color: "#18230F"
    }
  ];

  return (
    <section ref={sectionRef} className="bg-[#F5F1DC]" style={{ willChange: 'transform', marginTop: '-0.5px' }} id="features">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32">
        {/* Heading */}
        <div className="mb-16 md:mb-24">
          <h2 
            ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight max-w-4xl font-serif"
          >
            WorkNest meets HR teams where they are.
          </h2>
        </div>

        {/* Grid Container - 4 columns */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
              style={{ willChange: 'transform' }}
            >
              {/* Letter Display */}
              <div 
                className="mb-4 overflow-hidden rounded-lg flex items-center justify-center h-[280px] md:h-[320px] lg:h-[360px] transition-transform duration-700 ease-out group-hover:scale-105"
              >
                <span 
                  className="yarndings-20-regular text-[180px] md:text-[220px] lg:text-[260px] font-serif leading-none select-none"
                  style={{ color: feature.color }}
                >
                  {feature.letter}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl text-[#001BB7] mb-2 font-serif">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-[#001BB7]/70 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}