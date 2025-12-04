"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineSecondRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for sequential animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate first headline
      tl.fromTo(
        headlineRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1 }
      );

      // Animate second headline
      tl.fromTo(
        headlineSecondRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1 },
        '-=0.6' // Overlap with previous animation
      );

      // Animate image box
      tl.fromTo(
        imageBoxRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2 },
        '-=0.4'
      );

      // Animate description
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      );

      // Animate separator
      tl.fromTo(
        separatorRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 1, transformOrigin: 'bottom' },
        '-=0.3'
      );


    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section className="min-h-screen bg-[#0a0a0a] relative overflow-hidden" id="home">
      {/* Spooky background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">🎃</div>
        <div className="absolute top-40 right-20 text-5xl animate-pulse">👻</div>
        <div className="absolute bottom-40 left-1/4 text-4xl animate-bounce delay-100">🦇</div>
        <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse delay-200">🕷️</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32 relative z-10">
        {/* Main Headline with staggered layout */}
        <div className="mb-32 md:mb-40">
          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight">
            <div
              ref={headlineRef}
              className="sorts-mill-goudy-regular text-[#ff6b35] drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]"
            >
              Haunt Your Workflow
            </div>
            <div
              ref={headlineSecondRef}
              className="sorts-mill-goudy-regular text-[#6a0dad] md:ml-32 lg:ml-48 xl:ml-64 drop-shadow-[0_0_20px_rgba(106,13,173,0.5)]"
            >
              with Spectral AI.
            </div>
          </h1>
        </div>

        {/* Decorative box with image */}
        <div className="mb-16 md:mb-20">
          <div
            ref={imageBoxRef}
            className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-[#6a0dad] to-[#ff6b35] relative overflow-hidden rounded-3xl p-2 shadow-2xl shadow-[#6a0dad]/50"
          >
            <img
              src="https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=1200&h=800&fit=crop"
              alt="Spooky Halloween atmosphere"
              className="w-full h-full object-cover rounded-3xl opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent rounded-3xl flex items-end justify-center pb-8">
              <div className="flex gap-4 text-6xl">
                <span className="animate-bounce">👻</span>
                <span className="animate-bounce delay-100">🎃</span>
                <span className="animate-bounce delay-200">🦇</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description text */}
        <div
          ref={descriptionRef}
          className="max-w-3xl"
        >
          <p className="funnel-sans-regular text-2xl md:text-3xl lg:text-4xl text-[#ff8c00] leading-relaxed">
            Unleash supernatural productivity from beyond the veil 👻
          </p>
        </div>
      </div>

      {/* Yarndings Separator */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pb-8 relative z-10">
        <div
          ref={separatorRef}
          className="yarndings-20-regular text-4xl md:text-5xl text-[#6a0dad] leading-none whitespace-nowrap overflow-hidden"
        >
          YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
        </div>
      </div>
    </section>
  );
}