import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Placeholder for a compelling hero image - YOU WILL NEED TO ADD THIS IMAGE
import heroIllustration from '@/assets/img1.jpg'; // Ensure this path is correct

import { HowItWorksSection } from '@/components/HowItWorks';
import { StatsSection } from '@/components/Stats';

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section - Bold, Layered, and Visually Rich (Light Theme) */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-white"> {/* Light background */}

        {/* Dynamic Background Grid Overlay - Lighter lines */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <pattern id="pattern-grid-light" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="1" height="1" fill="#e5e7eb" /> {/* Very light gray grid lines */}
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-grid-light)"/>
          </svg>
        </div>

        {/* Subtle Gradient Overlay for Depth - Lighter */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-white/70 z-10"></div>

        {/* Main Content Container - Layered for visual interest, now wider */}
        <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between mx-auto w-[90%] px-4 sm:px-6 lg:px-8 gap-16 text-gray-900"> {/* Increased width to 90% */}

          {/* Text Content Block - Offset and with a background 'card' feel */}
          <div className="relative lg:w-1/2 p-8 lg:p-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 transform -rotate-1 lg:rotate-0 translate-y-8 lg:translate-y-0">
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-serif tracking-tight leading-tight text-gray-900 drop-shadow-md mb-4">
              Ignite Compassion.<br />
              <span className="bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent font-thin">
                End Food Waste.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl lg:text-2xl font-serif leading-relaxed text-gray-700 max-w-2xl">
              **FeedConnect** is the bridge between surplus food and animals in need. Join a vibrant community dedicated to reducing waste and nourishing lives.
            </p>

            {/* Call-to-Action Buttons - Prominent and styled */}
            <div className="mt-12 font-serif flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl border border-green-700"
              >
                <Link to="/register?type=restaurant">For Restaurants</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl"
              >
                <Link to="/register?type=ngo">For NGOs</Link>
              </Button>
            </div>
            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl border border-purple-700"
              >
                <Link to="/predictor-home">Discover Animal Health</Link>
              </Button>
            </div>
          </div>

          {/* Visual Element / Illustration Block - Layered and emphasized */}
          <div className="relative lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 transform rotate-2 lg:rotate-0 -translate-y-8 lg:translate-y-0">
            <img
              src={heroIllustration}
              alt="Illustration of food donation and happy animals"
              className="max-w-full h-auto rounded-xl shadow-xl border border-gray-300"
            />
            {/* Decorative Overlay Badge (Example: "Making a Difference") */}
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg text-sm uppercase tracking-wider border-2 border-white">
              Impact Fulfilled
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <HowItWorksSection />

      {/* Stats Section */}
      <StatsSection />
    </div>
  );
};