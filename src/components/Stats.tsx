// src/components/StatsSection.jsx (or .tsx if you're using TypeScript)
import React from 'react';

export const StatsSection = () => {
  return (
    <section className="py-28 bg-white relative overflow-hidden font-sans">
      {/* Subtle, Professional Background Texture: Geometric/Architectural Lines */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid-professional" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="20" y2="0" stroke="#f0f0f0" strokeWidth="0.5" /> {/* Light horizontal lines */}
              <line x1="0" y1="0" x2="0" y2="20" stroke="#f0f0f0" strokeWidth="0.5" /> {/* Light vertical lines */}
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-professional)"/>
          {/* Very subtle, large, abstract gradients for depth */}
          <circle cx="5%" cy="85%" r="30" fill="rgba(197, 225, 165, 0.1)" /> {/* Pale Green */}
          <circle cx="95%" cy="15%" r="35" fill="rgba(144, 202, 249, 0.1)" /> {/* Pale Blue */}
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Understated and authoritative */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4 leading-tight font-serif">
            Our Track Record of Impact
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Quantifying our commitment to a sustainable future, one partnership and one meal at a time.
          </p>
        </div>

        {/* Professional Stats Layout - Clean, structured, with subtle connections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-y-0 md:gap-x-12 items-start justify-center">

          {/* Stat 1: Restaurants Partnered */}
          <div className="relative flex flex-col items-center bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.01]">
            <div className="absolute -top-10 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 text-white"><path d="M6 22V7H4V2h10v15H6z"/><path d="M18 22V5h-2V2h4v20z"/></svg>
            </div>
            <div className="pt-12 pb-4 text-center">
              <div className="text-4xl font-extrabold text-gray-900 leading-none mb-1">1,234</div> {/* Reduced font size */}
              <div className="text-gray-700 text-base font-semibold tracking-wide">Restaurants Partnered</div> {/* Reduced font size */}
              <p className="mt-3 text-gray-500 text-sm leading-relaxed max-w-[200px] mx-auto">
                Businesses collaborating to repurpose surplus food and reduce waste.
              </p>
            </div>
          </div>

          {/* Stat 2: Meals Rescued - Central, with more prominence */}
          <div className="relative flex flex-col items-center bg-white p-8 rounded-xl shadow-xl border-2 border-blue-200 transform md:-translate-y-8 transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] z-20">
            <div className="absolute -top-12 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-box text-white"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </div>
            <div className="pt-16 pb-4 text-center">
              <div className="text-5xl font-extrabold text-gray-900 leading-none mb-2">5,678</div> {/* Slightly larger, but controlled */}
              <div className="text-gray-800 text-lg font-bold tracking-wide">Meals Rescued</div> {/* Slightly larger, but controlled */}
              <p className="mt-3 text-gray-600 text-sm leading-relaxed max-w-[220px] mx-auto">
                Nutritious meals diverted from waste and directed to those in critical need.
              </p>
            </div>
            {/* Professional connection line on desktop */}
            <div className="hidden md:block absolute left-full top-1/2 w-16 h-0.5 bg-gray-200 ml-4"></div>
            <div className="hidden md:block absolute right-full top-1/2 w-16 h-0.5 bg-gray-200 mr-4"></div>
          </div>

          {/* Stat 3: Animals Nourished */}
          <div className="relative flex flex-col items-center bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.01]">
            <div className="absolute -top-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paw-print text-white"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a6 6 0 0 0 2 8h2a6 6 0 0 0 2-8"/></svg>
            </div>
            <div className="pt-12 pb-4 text-center">
              <div className="text-4xl font-extrabold text-gray-900 leading-none mb-1">10,000+</div> {/* Reduced font size */}
              <div className="text-gray-700 text-base font-semibold tracking-wide">Animals Nourished</div> {/* Reduced font size */}
              <p className="mt-3 text-gray-500 text-sm leading-relaxed max-w-[200px] mx-auto">
                Providing essential nutrition and care to a growing number of vulnerable animals.
              </p>
            </div>
          </div>
        </div>

        {/* Reinforcing message at the bottom */}
        <div className="text-center mt-28 max-w-3xl mx-auto">
          <p className="text-lg font-serif text-gray-800 leading-relaxed">
            These figures reflect our dedication and the shared commitment of our community partners. Join us in expanding this vital impact.
          </p>
        </div>
      </div>
    </section>
  );
};