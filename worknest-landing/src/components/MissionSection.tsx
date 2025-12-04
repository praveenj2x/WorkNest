"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate image from left
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate content from right with stagger
      gsap.fromTo(
        ".mission-content > *",
        { opacity: 0, x: 60, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#1a0a1a] to-[#0a0a0a] py-20 md:py-32 relative overflow-hidden">
      {/* Spooky background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl">🕸️</div>
        <div className="absolute bottom-20 right-20 text-8xl">🦇</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Emoji Display Section - Left */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-2xl flex items-center justify-center h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-[#6a0dad]/20 to-[#ff6b35]/20 border-2 border-[#6a0dad]/30">
              <span className="text-[200px] md:text-[280px] lg:text-[360px] leading-none select-none filter drop-shadow-[0_0_40px_rgba(255,107,53,0.6)]">
                🎃
              </span>
            </div>
          </div>

          {/* Content Section - Right */}
          <div ref={contentRef} className="mission-content">
            {/* Small heading */}
            <div className="mb-6">
              <span className="funnel-sans-medium text-sm md:text-base text-[#ff6b35] uppercase tracking-wider">
                Our Haunting Mission
              </span>
            </div>

            {/* Main heading */}
            <h2 className="sorts-mill-goudy-regular text-4xl md:text-5xl lg:text-6xl text-[#ff6b35] leading-tight mb-8 drop-shadow-[0_0_20px_rgba(255,107,53,0.3)]">
              Summoning the Future of Spectral Work 👻
            </h2>

            {/* Mission statement */}
            <div className="space-y-6 mb-8">
              <p className="funnel-sans-regular text-lg md:text-xl text-[#ff8c00]/80 leading-relaxed">
                We believe that great covens are built by great phantoms. Our mission is to empower
                supernatural professionals with mystical tools that make managing spirits not just easier,
                but more bewitching.
              </p>

              <p className="funnel-sans-regular text-lg md:text-xl text-[#ff8c00]/80 leading-relaxed">
                By combining cutting-edge dark magic with phantom-centered design, we're creating a future
                where ghostly teams can focus on what truly matters: building thriving haunted cultures
                and helping every specter reach their full supernatural potential.
              </p>
            </div>

            {/* Mission points */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1">🔮</div>
                <p className="funnel-sans-regular text-base md:text-lg text-[#ff8c00]/70">
                  Simplify complex haunting processes with intelligent necromancy
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1">🌙</div>
                <p className="funnel-sans-regular text-base md:text-lg text-[#ff8c00]/70">
                  Provide spectral insights from the crystal ball that drive better cursed decision-making
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1">⚡</div>
                <p className="funnel-sans-regular text-base md:text-lg text-[#ff8c00]/70">
                  Create more spine-chilling and supportive phantom experiences
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}