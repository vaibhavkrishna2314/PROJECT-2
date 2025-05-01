import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Bookmark, ExternalLink } from 'lucide-react';
import { usePrediction } from '@/contexts/PredictionContext';
import { predictDisease } from '@/services/predictionService';
import { DiseaseResult } from '@/types';

const ResultsPage: React.FC = () => {
  const { predictionData, addToHistory } = usePrediction();
  const navigate = useNavigate();
  const [results, setResults] = useState<DiseaseResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!predictionData) {
      navigate('/predictor');
      return;
    }

    // Get prediction results
    const predictedResults = predictDisease(predictionData.animalType, predictionData.symptoms);
    
    // Simulate API delay for UX
    const timer = setTimeout(() => {
      setResults(predictedResults);
      setIsLoading(false);
      
      // Add to history if we have results
      if (predictedResults.length > 0) {
        addToHistory({
          id: Date.now().toString(),
          animalType: predictionData.animalType,
          symptoms: predictionData.symptoms,
          results: predictedResults,
          timestamp: predictionData.timestamp
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [predictionData, navigate, addToHistory]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-300 rounded mb-8"></div>
          <div className="h-64 w-full max-w-2xl bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
        <p className="mt-6 text-gray-600">Analyzing symptoms and generating predictions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/predictor')}
          className="mb-6 flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to predictor
        </button>
        
        <h1 className="text-3xl font-bold mb-6">Prediction Results</h1>
        
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">
              <span className="font-medium">Animal Type:</span>{' '}
              <span className="capitalize">{predictionData?.animalType}</span>
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Symptoms:</span>{' '}
              {predictionData?.symptoms.join(', ')}
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Date:</span>{' '}
              {new Date(predictionData?.timestamp || '').toLocaleString()}
            </p>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 text-gray-700 rounded-md p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-warning mr-2 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Important Disclaimer</p>
              <p className="text-sm mt-1">
                This prediction is for informational purposes only and should not replace professional veterinary advice.
                If your pet is showing signs of illness, please consult with a veterinarian.
              </p>
            </div>
          </div>
        </div>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Potential Diseases</h2>
          
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                    index === 0 ? 'border-primary/50 bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{result.disease}</h3>
                    <div 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.confidence > 75
                          ? 'bg-error/10 text-error'
                          : result.confidence > 50
                          ? 'bg-warning/10 text-warning'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {result.confidence}% match
                    </div>
                  </div>
                  
                  <p className="mt-2 text-gray-600">{result.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Common Symptoms:</h4>
                    <div className="flex flex-wrap">
                      {result.symptoms.map(symptom => (
                        <span 
                          key={symptom} 
                          className={`symptom-tag ${
                            predictionData?.symptoms.includes(symptom) 
                              ? 'bg-primary/20 border border-primary/20' 
                              : ''
                          }`}
                        >
                          {symptom}
                          {predictionData?.symptoms.includes(symptom) && (
                            <span className="ml-1 text-xs">✓</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No diseases matched the provided symptoms with sufficient confidence.
                Try adding more specific symptoms or consulting with a veterinarian.
              </p>
              <button
                onClick={() => navigate('/predictor')}
                className="btn-primary"
              >
                Try Different Symptoms
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/predictor')}
            className="btn bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Try Another Prediction
          </button>
          <button
            onClick={() => navigate('/history')}
            className="btn-secondary flex items-center"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;