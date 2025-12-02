"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Animate pricing cards
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      price: '49',
      period: 'per month',
      features: [
        'Up to 50 employees',
        'Core HR features',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'For growing teams that need more power',
      price: '149',
      period: 'per month',
      features: [
        'Up to 200 employees',
        'Advanced HR automation',
        'Priority support',
        'AI-powered insights',
        'Custom integrations',
        'Advanced analytics'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Unlimited employees',
        'Full platform access',
        'Dedicated support',
        'Custom AI training',
        'Advanced security',
        'SLA guarantee'
      ],
      highlighted: false
    }
  ];

  return (
    <section ref={sectionRef} className="bg-[#F5F1DC] py-20 md:py-32" id="pricing">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight mb-6">
            Simple, transparent pricing
          </h2>
          <p className="funnel-sans-regular text-xl md:text-2xl text-[#001BB7]/70 max-w-2xl mx-auto">
            Choose the plan that's right for your team
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => { 
                cardsRef.current[index] = el; 
              }}
              className={`relative rounded-3xl p-8 md:p-10 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-[#001BB7] text-white scale-105 md:scale-110 shadow-2xl'
                  : 'bg-white border-2 border-[#001BB7]/10 hover:border-[#0046FF]/30 hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="funnel-sans-semibold text-sm bg-[#FF8040] text-white px-4 py-2 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3
                className={`sorts-mill-goudy-regular text-3xl md:text-4xl mb-3 ${
                  plan.highlighted ? 'text-white' : 'text-[#001BB7]'
                }`}
              >
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className={`funnel-sans-regular text-base mb-6 ${
                  plan.highlighted ? 'text-white/80' : 'text-[#001BB7]/70'
                }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  {plan.price !== 'Custom' && (
                    <span className="text-2xl funnel-sans-regular">$</span>
                  )}
                  <span
                    className={`sorts-mill-goudy-regular text-5xl md:text-6xl ${
                      plan.highlighted ? 'text-white' : 'text-[#001BB7]'
                    }`}
                  >
                    {plan.price}
                  </span>
                </div>
                <p
                  className={`funnel-sans-regular text-sm mt-1 ${
                    plan.highlighted ? 'text-white/70' : 'text-[#001BB7]/60'
                  }`}
                >
                  {plan.period}
                </p>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-full funnel-sans-semibold text-lg mb-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white text-[#001BB7] hover:bg-[#FF8040] hover:text-white'
                    : 'bg-[#001BB7] text-white hover:bg-[#0046FF]'
                }`}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-[#FF8040]' : 'text-[#0046FF]'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={`funnel-sans-regular ${
                        plan.highlighted ? 'text-white/90' : 'text-[#001BB7]/80'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <p className="funnel-sans-regular text-[#001BB7]/60 text-lg">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}