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
      title: "Spectral Onboarding",
      description: "Summon new spirits into your team with ethereal onboarding that materializes from the digital void. No paperwork survives the haunting.",
      emoji: "👻",
      color: "#6a0dad"
    },
    {
      title: "Phantom Management",
      description: "Command your ghostly workforce from a mystical dashboard. Track spectral performance and supernatural team dynamics with ease.",
      emoji: "🎃",
      color: "#ff6b35"
    },
    {
      title: "Cursed Reviews",
      description: "Conduct bewitched performance reviews with AI-powered dark magic, goal tracking from beyond, and automated feedback from the shadows.",
      emoji: "🦇",
      color: "#ff8c00"
    },
    {
      title: "Haunted Analytics",
      description: "Peer into the crystal ball of data-driven insights. Predictive visions and customizable reports from the other side.",
      emoji: "🕷️",
      color: "#39ff14"
    }
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#0a0a0a] to-[#1a0a1a] relative overflow-hidden" style={{ willChange: 'transform', marginTop: '-0.5px' }} id="features">
      {/* Spooky background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-9xl">🕸️</div>
        <div className="absolute top-40 right-20 text-8xl">🦇</div>
        <div className="absolute bottom-40 left-1/4 text-7xl">🎃</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32 relative z-10">
        {/* Heading */}
        <div className="mb-16 md:mb-24">
          <h2
            ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl text-[#ff6b35] leading-tight max-w-4xl font-serif drop-shadow-[0_0_20px_rgba(255,107,53,0.3)]"
          >
            GhostNet haunts your workflow from the shadows. 👻
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
              className="feature-card group bg-gradient-to-br from-[#1a0a1a] to-[#0a0a0a] border border-[#6a0dad]/30 rounded-2xl p-6 hover:border-[#ff6b35]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#6a0dad]/30"
              style={{ willChange: 'transform' }}
            >
              {/* Emoji Display */}
              <div
                className="mb-4 overflow-hidden rounded-lg flex items-center justify-center h-[200px] md:h-[220px] lg:h-[240px] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-6"
              >
                <span
                  className="text-[120px] md:text-[140px] lg:text-[160px] leading-none select-none filter drop-shadow-[0_0_30px_rgba(255,107,53,0.5)]"
                >
                  {feature.emoji}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl text-[#ff6b35] mb-2 font-serif">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-[#ff8c00]/70 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}