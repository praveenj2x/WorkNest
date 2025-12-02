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
    <section className="min-h-screen bg-[#F5F1DC]" id="home">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32">
        {/* Main Headline with staggered layout */}
        <div className="mb-32 md:mb-40">
          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight">
            <div
              ref={headlineRef}
              className="sorts-mill-goudy-regular text-[#001BB7]"
            >
              Empower Freelancers
            </div>
            <div
              ref={headlineSecondRef}
              className="sorts-mill-goudy-regular text-[#001BB7] md:ml-32 lg:ml-48 xl:ml-64"
            >
              with Intelligence.
            </div>
          </h1>
        </div>

        {/* Decorative box with image */}
        <div className="mb-16 md:mb-20">
          <div
            ref={imageBoxRef}
            className="w-full h-64 md:h-80 lg:h-96 bg-[#0046FF] relative overflow-hidden rounded-3xl p-2"
          >
            <img
              src="https://ik.imagekit.io/4vuzhxb7l/hero.gif?updatedAt=1762240071864"
              alt="Team collaboration"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>

        {/* Description text */}
        <div
          ref={descriptionRef}
          className="max-w-3xl"
        >
          <p className="funnel-sans-regular text-2xl md:text-3xl lg:text-4xl text-[#001BB7] leading-relaxed">
            Be an exceptional leader
          </p>
        </div>
      </div>

      {/* Yarndings Separator */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pb-8">
        <div
          ref={separatorRef}
          className="yarndings-20-regular text-4xl md:text-5xl text-[#0046FF] leading-none whitespace-nowrap overflow-hidden"
        >
          YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
        </div>
      </div>
    </section>
  );
}