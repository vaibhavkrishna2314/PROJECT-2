// src/components/HowItWorksSection.jsx (or .tsx if you're using TypeScript)
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils, Building2, Stethoscope, ArrowDown } from 'lucide-react'; // Added ArrowDown icon
import img1 from '@/assets/img1.jpg'; // Placeholder - replace with real images
import img2 from '@/assets/img2.jpg'; // Placeholder - replace with real images
import img3 from '@/assets/img3.jpg'; // Placeholder - replace with real images

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background blobs for organic, dynamic feel */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 relative">
          <h2 className="text-5xl font-serif font-extrabold tracking-tight text-gray-800 sm:text-6xl mb-4">
            Our Simple Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Witness how effortlessly surplus food transforms into hope and makes a profound difference in the lives of animals.
          </p>
          {/* Subtle decorative elements for the header */}
          <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-24 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></span>
        </div>

        {/* Step 1: Image Left, Content Right */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-24">
          <div className="lg:w-1/2 relative">
            <img
              src={img1}
              alt="Restaurant listing surplus food"
              className="rounded-3xl shadow-xl border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300 ease-out"
            />
            {/* Overlay number */}
            <div className="absolute -top-6 -left-6 bg-gradient-to-br from-green-500 to-green-600 text-white font-extrabold rounded-full h-16 w-16 flex items-center justify-center text-2xl shadow-xl border-4 border-white animate-bounce-slow">
              1
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-4xl font-serif font-bold text-gray-800 mb-4">
              List Surplus Food
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              **For Restaurants:** Easily list your perfectly good surplus food – from banquet leftovers to daily specials. Our intuitive platform makes it simple to specify quantity, type, and availability with just a few clicks. Transform potential waste into a powerful act of compassion.
            </p>
            <ul className="list-disc list-inside text-gray-500 text-base space-y-1">
              <li>Quick & easy listing process</li>
              <li>Detailed food type and quantity options</li>
              <li>Schedule pickup times efficiently</li>
            </ul>
          </div>
        </div>

        {/* Visual Separator & Connector */}
        <div className="flex justify-center my-16">
          <ArrowDown size={64} className="text-gray-400 animate-pulse-slow" />
        </div>

        {/* Step 2: Image Right, Content Left */}
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-20 mb-24">
          <div className="lg:w-1/2 relative">
            <img
              src={img2}
              alt="NGO connecting with restaurant"
              className="rounded-3xl shadow-xl border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300 ease-out"
            />
            {/* Overlay number */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white font-extrabold rounded-full h-16 w-16 flex items-center justify-center text-2xl shadow-xl border-4 border-white animate-bounce-slow animation-delay-500">
              2
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-right"> {/* Changed text alignment for reverse layout */}
            <h3 className="text-4xl font-serif font-bold text-gray-800 mb-4">
              Connect with NGOs
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              **For NGOs:** Our smart matching system instantly connects your organization with nearby restaurants that have available food. Say goodbye to manual searches and hello to efficient, reliable food donations tailored to your animals' needs.
            </p>
            <ul className="list-disc list-inside text-gray-500 text-base space-y-1 lg:pl-16"> {/* Adjusted padding for list */}
              <li>Intelligent location-based matching</li>
              <li>Real-time notification of available food</li>
              <li>Streamlined communication tools</li>
            </ul>
          </div>
        </div>

        {/* Visual Separator & Connector */}
        <div className="flex justify-center my-16">
          <ArrowDown size={64} className="text-gray-400 animate-pulse-slow animation-delay-1000" />
        </div>

        {/* Step 3: Image Left, Content Right (similar to step 1 for visual rhythm) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="lg:w-1/2 relative">
            <img
              src={img3}
              alt="Animals being fed"
              className="rounded-3xl shadow-xl border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300 ease-out"
            />
            {/* Overlay number */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white font-extrabold rounded-full h-16 w-16 flex items-center justify-center text-2xl shadow-xl border-4 border-white animate-bounce-slow animation-delay-1000">
              3
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-4xl font-serif font-bold text-gray-800 mb-4">
              Nourish & Impact
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              **For Animals:** The journey culminates here. Watch as wholesome, rescued food directly nourishes animals in need, improving their health and well-being. Every donation significantly reduces food waste and contributes to a kinder planet.
            </p>
            <ul className="list-disc list-inside text-gray-500 text-base space-y-1">
              <li>Direct positive impact on animal welfare</li>
              <li>Significant reduction in food waste</li>
              <li>Contribution to a sustainable ecosystem</li>
            </ul>
          </div>
        </div>

        {/* Call to Action at the end */}
        <div className="text-center mt-24">
          <p className="text-2xl font-serif font-semibold text-gray-700 mb-8">
            Ready to make a difference?
          </p>
          {/* Using existing buttons for consistency */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/register?type=restaurant">Join as a Restaurant</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-green-700 border-2 border-green-700 hover:bg-green-700 hover:text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/register?type=ngo">Join as an NGO</Link>
            </Button>
          </div>
        </div>

      </div>

      {/* Tailwind CSS keyframes for animations (add this to your main CSS file or a dedicated tailwind layer) */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            border-radius: 70% 30% 50% 50% / 50% 50% 50% 50%;
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            border-radius: 40% 60% 70% 30% / 60% 40% 40% 60%;
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 2s infinite ease-in-out;
        }

        @keyframes pulse-slow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 2s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};