export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')`
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto container-padding section-spacing">
        {/* Main Headline */}
        <div className="mb-12">
          <h1 className="sorts-mill-goudy-regular text-7xl md:text-8xl lg:text-9xl text-white leading-tight">
            <div className="text-left max-w-6xl mx-auto">
              Empower HR
            </div>
            <div className="text-left max-w-6xl mx-auto ml-32 md:ml-48 lg:ml-64">
              with Intelligence
            </div>
          </h1>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-left mb-16">
          <p className="funnel-sans-regular text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
            Transform your workplace with AI-powered insights, streamlined workflows, 
            and intelligent automation that puts people first.
          </p>
        </div>

        {/* Video Box */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="aspect-video">
              <video 
                className="w-full h-full object-cover"
                controls
                poster="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            {/* Video Overlay with Play Button (for when no video source) */}
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}