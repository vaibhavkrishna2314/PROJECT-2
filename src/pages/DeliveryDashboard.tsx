import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { mockOrders } from '../mockData';
import bgImage from '../images/frame-with-dogs-vector-white-background_53876-127700.avif'; // adjust the path if needed


const DeliveryDashboard = () => {
  const navigate = useNavigate();

  const handleAcceptOrder = (orderId: string) => {
    navigate(`/delivery-tracking/${orderId}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Available Orders</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-4">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    {order.restaurantName}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">Pickup</p>
                      <p className="text-sm text-gray-500">{order.restaurantAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-500">{order.ngoName}</p>
                      <p className="text-sm text-gray-500">{order.ngoAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
              <button
                onClick={() => handleAcceptOrder(order.id)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-primary-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
              >
                Accept Order
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;