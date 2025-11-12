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
    <section ref={sectionRef} className="bg-[#F5F1DC] py-20 md:py-32">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Display Section - Left */}
          <div ref={imageRef} className="relative">
            <div className="relative overflow-hidden rounded-2xl flex items-center justify-center h-[400px] md:h-[500px] lg:h-[600px]">
              <span className="yarndings-20-regular text-[280px] md:text-[380px] lg:text-[480px] font-serif text-[#FF204E] leading-none select-none">
                l
              </span>
            </div>
          </div>

          {/* Content Section - Right */}
          <div ref={contentRef} className="mission-content">
            {/* Small heading */}
            <div className="mb-6">
              <span className="funnel-sans-medium text-sm md:text-base text-[#0046FF] uppercase tracking-wider">
                Our Mission
              </span>
            </div>

            {/* Main heading */}
            <h2 className="sorts-mill-goudy-regular text-4xl md:text-5xl lg:text-6xl text-[#001BB7] leading-tight mb-8">
              Transforming HR for the Future of Work
            </h2>

            {/* Mission statement */}
            <div className="space-y-6 mb-8">
              <p className="funnel-sans-regular text-lg md:text-xl text-[#001BB7]/80 leading-relaxed">
                We believe that great companies are built by great people. Our mission is to empower 
                HR professionals with intelligent tools that make managing people not just easier, 
                but more meaningful.
              </p>
              
              <p className="funnel-sans-regular text-lg md:text-xl text-[#001BB7]/80 leading-relaxed">
                By combining cutting-edge AI with human-centered design, we're creating a future 
                where HR teams can focus on what truly matters: building thriving workplace cultures 
                and helping every employee reach their full potential.
              </p>
            </div>

            {/* Mission points */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-[#0046FF] rounded-full mt-3 flex-shrink-0"></div>
                <p className="funnel-sans-regular text-base md:text-lg text-[#001BB7]/70">
                  Simplify complex HR processes with intelligent automation
                </p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-[#0046FF] rounded-full mt-3 flex-shrink-0"></div>
                <p className="funnel-sans-regular text-base md:text-lg text-[#001BB7]/70">
                  Provide actionable insights that drive better decision-making
                </p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-[#0046FF] rounded-full mt-3 flex-shrink-0"></div>
                <p className="funnel-sans-regular text-base md:text-lg text-[#001BB7]/70">
                  Create more engaging and supportive employee experiences
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}