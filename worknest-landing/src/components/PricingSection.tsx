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
      name: 'Poltergeist',
      description: 'For small haunts just starting their spectral journey',
      price: '13',
      period: 'per moon cycle',
      emoji: '👻',
      features: [
        'Up to 50 phantom employees',
        'Basic haunting features',
        'Ouija board support',
        'Spectral analytics',
        'Mobile séance access'
      ],
      highlighted: false
    },
    {
      name: 'Phantom',
      description: 'For growing covens that need supernatural power',
      price: '31',
      period: 'per moon cycle',
      emoji: '🎃',
      features: [
        'Up to 200 ghostly employees',
        'Advanced dark magic automation',
        'Priority necromancy support',
        'AI-powered crystal ball insights',
        'Custom spell integrations',
        'Advanced haunting analytics'
      ],
      highlighted: true
    },
    {
      name: 'Demon Lord',
      description: 'Ultimate power for massive supernatural organizations',
      price: '666',
      period: 'eternal contract',
      emoji: '😈',
      features: [
        'Unlimited undead workforce',
        'Full underworld access',
        'Dedicated demon support',
        'Custom AI necromancy',
        'Hellfire security',
        'Immortal SLA guarantee'
      ],
      highlighted: false
    }
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#1a0a1a] to-[#0a0a0a] py-20 md:py-32 relative overflow-hidden" id="pricing">
      {/* Spooky background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-20 text-9xl">🕸️</div>
        <div className="absolute bottom-20 right-20 text-8xl">🦇</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#ff6b35] leading-tight mb-6 drop-shadow-[0_0_20px_rgba(255,107,53,0.3)]">
            Frighteningly affordable pricing 💀
          </h2>
          <p className="funnel-sans-regular text-xl md:text-2xl text-[#ff8c00]/70 max-w-2xl mx-auto">
            Choose your level of supernatural power
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
              className={`relative rounded-3xl p-8 md:p-10 transition-all duration-300 border-2 ${plan.highlighted
                  ? 'bg-gradient-to-br from-[#6a0dad] to-[#8b2dd9] text-white scale-105 md:scale-110 shadow-2xl shadow-[#6a0dad]/50 border-[#ff6b35]'
                  : 'bg-gradient-to-br from-[#1a0a1a] to-[#0a0a0a] border-[#6a0dad]/30 hover:border-[#ff6b35]/50 hover:shadow-xl hover:shadow-[#6a0dad]/30'
                }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="funnel-sans-semibold text-sm bg-[#ff6b35] text-white px-4 py-2 rounded-full shadow-lg">
                    MOST CURSED
                  </span>
                </div>
              )}

              {/* Emoji */}
              <div className="text-6xl mb-4 text-center">{plan.emoji}</div>

              {/* Plan Name */}
              <h3
                className={`sorts-mill-goudy-regular text-3xl md:text-4xl mb-3 text-center ${plan.highlighted ? 'text-white' : 'text-[#ff6b35]'
                  }`}
              >
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className={`funnel-sans-regular text-base mb-6 text-center ${plan.highlighted ? 'text-white/80' : 'text-[#ff8c00]/70'
                  }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2 justify-center">
                  <span className="text-2xl funnel-sans-regular">$</span>
                  <span
                    className={`sorts-mill-goudy-regular text-5xl md:text-6xl ${plan.highlighted ? 'text-white' : 'text-[#ff6b35]'
                      }`}
                  >
                    {plan.price}
                  </span>
                </div>
                <p
                  className={`funnel-sans-regular text-sm mt-1 text-center ${plan.highlighted ? 'text-white/70' : 'text-[#ff8c00]/60'
                    }`}
                >
                  {plan.period}
                </p>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-full funnel-sans-semibold text-lg mb-8 transition-all duration-300 ${plan.highlighted
                    ? 'bg-white text-[#6a0dad] hover:bg-[#ff6b35] hover:text-white shadow-lg'
                    : 'bg-[#6a0dad] text-white hover:bg-[#8b2dd9] hover:shadow-lg hover:shadow-[#6a0dad]/50'
                  }`}
              >
                {plan.name === 'Demon Lord' ? 'Summon Demons' : 'Start Haunting'}
              </button>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className={`w-6 h-6 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-[#ff6b35]' : 'text-[#39ff14]'
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
                      className={`funnel-sans-regular ${plan.highlighted ? 'text-white/90' : 'text-[#ff8c00]/80'
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
          <p className="funnel-sans-regular text-[#ff8c00]/60 text-lg">
            All plans include a 13-night free trial. No soul required. 👻
          </p>
        </div>
      </div>
    </section>
  );
}