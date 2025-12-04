"use client";
import { motion } from 'framer-motion';

export default function OurStory() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="bg-gradient-to-b from-[#0a0a0a] to-[#1a0a1a] py-20 md:py-32 relative overflow-hidden">
      {/* Spooky background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl">🕸️</div>
        <div className="absolute bottom-20 right-20 text-8xl">🦇</div>
        <div className="absolute top-1/2 right-10 text-7xl">🎃</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
            <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#ff6b35] leading-tight mb-6 drop-shadow-[0_0_30px_rgba(255,107,53,0.4)]">
              Our Haunting Tale 📖
            </h2>
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#ff8c00]/70 max-w-3xl mx-auto">
              Every great haunting starts with a simple curse and the determination to make it eternal. 👻
            </p>
          </motion.div>

          {/* Story Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-gradient-to-br from-[#1a0a1a] to-[#0a0a0a] border border-[#6a0dad]/30 rounded-2xl p-6 hover:border-[#ff6b35]/50 transition-all duration-500">
                <div className="text-5xl mb-4">🌙</div>
                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#ff6b35] mb-4">
                  The Dark Beginning
                </h3>
                <p className="funnel-sans-regular text-lg text-[#ff8c00]/80 leading-relaxed">
                  GhostNet was summoned from a simple séance: supernatural professionals spend too much time
                  on mortal tasks and not enough time on what truly matters—haunting people
                  and building great phantom cultures in the spirit realm. 🎃
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#1a0a1a] to-[#0a0a0a] border border-[#6a0dad]/30 rounded-2xl p-6 hover:border-[#ff6b35]/50 transition-all duration-500">
                <div className="text-5xl mb-4">🔮</div>
                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#ff6b35] mb-4">
                  Our Cursed Vision
                </h3>
                <p className="funnel-sans-regular text-lg text-[#ff8c00]/80 leading-relaxed">
                  We envision a realm where dark magic amplifies spectral potential rather than banishing it.
                  Where phantom teams are empowered with mystical tools that help them create more spine-chilling,
                  haunting, and supernaturally productive afterlife environments. 🦇
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#1a0a1a] to-[#0a0a0a] border border-[#6a0dad]/30 rounded-2xl p-6 hover:border-[#ff6b35]/50 transition-all duration-500">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#ff6b35] mb-4">
                  Today & The Eternal Beyond
                </h3>
                <p className="funnel-sans-regular text-lg text-[#ff8c00]/80 leading-relaxed">
                  We're still in the early stages of our haunting, but we're committed to conjuring
                  something truly cursed. Every spell we cast, every potion we brew, is guided
                  by our core belief that great necromancy should make the afterlife more spectral, not less. 👻
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#6a0dad]/40 shadow-2xl shadow-[#6a0dad]/30">
                <img
                  src="https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800&h=600&fit=crop"
                  alt="Spooky Halloween atmosphere"
                  className="w-full h-[400px] md:h-[500px] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6a0dad]/60 via-transparent to-[#ff6b35]/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl animate-pulse">👻</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}