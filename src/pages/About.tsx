import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Truck, PawPrint, Users, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Dogs Fed Daily', value: '500+', icon: PawPrint },
    { label: 'Restaurant Partners', value: '50+', icon: Utensils },
    { label: 'NGO Partners', value: '20+', icon: Users },
    { label: 'Hours of Operation', value: '24/7', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[500px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg" 
            alt="Street dogs" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-6">Feeding Hope to Street Dogs</h1>
            <p className="text-xl mb-8">Connecting restaurants with NGOs to ensure no street dog goes hungry. Join our mission to make a difference in their lives.</p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg">
              Join Our Mission
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe every street dog deserves a meal. Through our innovative platform, we connect restaurants 
            with surplus food to NGOs dedicated to feeding street dogs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-green-600 mb-6">
              <Heart className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Compassion First</h3>
            <p className="text-gray-600 leading-relaxed">
              Our network of caring restaurants and dedicated NGOs work together to ensure street dogs 
              receive regular, nutritious meals. Every contribution makes a difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-green-600 mb-6">
              <Utensils className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Food Recovery</h3>
            <p className="text-gray-600 leading-relaxed">
              We partner with restaurants to collect surplus food that would otherwise go to waste, 
              giving it new purpose in feeding hungry street dogs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-green-600 mb-6">
              <Truck className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Efficient Delivery</h3>
            <p className="text-gray-600 leading-relaxed">
              Our dedicated delivery network ensures food reaches NGOs quickly and efficiently, 
              maintaining quality and safety throughout the process.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to make a big difference</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Restaurant Sign-up',
                description: 'Restaurants register and indicate their food availability schedule.'
              },
              {
                step: '02',
                title: 'NGO Matching',
                description: 'We connect restaurants with nearby NGOs based on location and capacity.'
              },
              {
                step: '03',
                title: 'Food Distribution',
                description: 'Our delivery partners collect and distribute food to street dogs.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute top-0 right-0 bg-green-100 text-green-600 text-6xl font-bold opacity-10 p-4 transform translate-x-4 -translate-y-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 relative z-10">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;