import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import bgImage from '../images/istockphoto-1292897490-612x612.jpg'; // Ensure the path is correct

const DeliveryCompletion = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Delivery Completed!
        </h2>
        <p className="mt-2 text-lg text-gray-700">
          Thank you for helping distribute food to those in need.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DeliveryCompletion;
