import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils, Building2, Stethoscope } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-beige py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-charcoal sm:text-6xl">
              Reduce Food Waste,{' '}
              <span className="text-green-600">Save Animal Lives</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-charcoal/80">
              Connect restaurants with animal welfare NGOs to reduce food waste and help feed animals in need.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link to="/register?type=restaurant">I'm a Restaurant</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/register?type=ngo">I'm an NGO</Link>
              </Button>
            </div><br />
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300"
            >
              <Link to="/predictor-home">Check My Animal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-charcoal sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-neutral-charcoal/70">
              Three simple steps to make a difference
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600">
                <Utensils size={48} />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-neutral-charcoal">
                List Surplus Food
              </h3>
              <p className="mt-2 text-neutral-charcoal/70">
                Restaurants list their surplus food with details about quantity and type
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600">
                <Building2 size={48} />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-neutral-charcoal">
                Connect with NGOs
              </h3>
              <p className="mt-2 text-neutral-charcoal/70">
                NGOs are automatically matched with nearby restaurants
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600">
                <Stethoscope size={48} />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-neutral-charcoal">
                Help Animals
              </h3>
              <p className="mt-2 text-neutral-charcoal/70">
                Food is collected and distributed to animals in need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-blue py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">1,234</div>
              <div className="mt-2 text-white/80">Restaurants Registered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">5,678</div>
              <div className="mt-2 text-white/80">Successful Donations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10,000+</div>
              <div className="mt-2 text-white/80">Animals Helped</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};