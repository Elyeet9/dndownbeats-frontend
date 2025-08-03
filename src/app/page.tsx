import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="font-display text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl pb-2">
            Dungeons
          </h1>
          <div className="font-display text-4xl md:text-6xl font-bold text-white flex items-center justify-center gap-4">
            <span>&</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
              Downbeats
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your ultimate playlist manager for epic adventures. Organize your soundtracks by categories and subcategories to create the perfect atmosphere for every campaign.
        </p>

        {/* Description */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-gray-400 text-lg">
            Whether you&apos;re exploring ancient dungeons, engaging in epic battles, or enjoying peaceful tavern moments, 
            find the perfect soundtrack to enhance your D&D experience.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Link 
            href="/categories"
            className="inline-flex items-center px-8 py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            <span>Start Your Adventure</span>
            <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-40"></div>
      </div>
    </div>
  );
}
