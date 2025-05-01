import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Trash2 } from 'lucide-react';
import { usePrediction } from '@/contexts/PredictionContext';

const HistoryPage: React.FC = () => {
  const { history, removeFromHistory } = usePrediction();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prediction History</h1>
        
        {history.length === 0 ? (
          <div className="card text-center py-12">
            <h2 className="text-xl font-medium text-gray-700 mb-4">No history yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't made any disease predictions yet. Start by analyzing your pet's symptoms.
            </p>
            <Link to="/predictor" className="btn-primary inline-flex items-center">
              Make a Prediction
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div key={item.id} className="card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold capitalize">{item.animalType}</h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(item.timestamp)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className="p-2 text-gray-400 hover:text-error rounded-full hover:bg-gray-50 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Symptoms:</h3>
                  <div className="flex flex-wrap mt-1">
                    {item.symptoms.map((symptom) => (
                      <span key={symptom} className="symptom-tag">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">Top Prediction:</h3>
                  {item.results.length > 0 ? (
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.results[0].disease}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.results[0].confidence > 75
                            ? 'bg-error/10 text-error'
                            : item.results[0].confidence > 50
                            ? 'bg-warning/10 text-warning'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.results[0].confidence}% match
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-1">No predictions available</p>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link
                    to="/predictor"
                    className="text-primary hover:underline text-sm mr-4"
                  >
                    New Prediction
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;