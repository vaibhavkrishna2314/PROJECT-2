import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PawPrint, Stethoscope, History, Info } from 'lucide-react';

const HomePage1: React.FC = () => {
  const features = [
    {
      title: 'Symptom Analysis',
      description: 'Input your pet\'s symptoms to get instant disease predictions',
      icon: <PawPrint className="h-8 w-8 text-primary" />,
      link: '/predictor'
    },
    {
      title: 'Disease Information',
      description: 'Learn about common animal diseases, their symptoms and treatments',
      icon: <Stethoscope className="h-8 w-8 text-secondary" />,
      link: '/about'
    },
    {
      title: 'Prediction History',
      description: 'Keep track of previous predictions and monitor your pet\'s health over time',
      icon: <History className="h-8 w-8 text-accent" />,
      link: '/history'
    },
    {
      title: 'Expert Resources',
      description: 'Find information about when to consult a veterinarian',
      icon: <Info className="h-8 w-8 text-primary" />,
      link: '/about'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/90 to-secondary/90 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7788351/pexels-photo-7788351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] mix-blend-overlay opacity-20 bg-no-repeat bg-cover"></div>
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:py-32 lg:px-16">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Animal Disease Predictor
          </h1>
          <p className="mt-6 max-w-lg text-xl text-white/90">
            Use our AI-powered tool to identify potential health issues in your pets based on their symptoms.
            Quick diagnosis leads to better care.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/predictor"
              className="btn bg-white text-primary hover:bg-gray-100 inline-flex items-center"
            >
              Start Prediction
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="btn bg-transparent border border-white text-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center">How PetHealth AI Helps You</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card hover:shadow-lg group"
            >
              <div className="rounded-lg p-3 bg-gray-50 inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link 
                to={feature.link} 
                className="text-primary font-medium flex items-center group-hover:underline"
              >
                Learn more 
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold">Ready to check your pet's health?</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI-powered system analyzes symptoms to identify potential health issues. 
          It's quick, easy, and may help you determine if veterinary care is needed.
        </p>
        <Link
          to="/predictor"
          className="mt-8 inline-block btn-primary"
        >
          Try the Disease Predictor
        </Link>
      </div>
    </div>
  );
};

export default HomePage1;