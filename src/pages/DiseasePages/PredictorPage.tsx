import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, PlusCircle, Search, AlertTriangle } from 'lucide-react';
import { usePrediction } from '@/contexts/PredictionContext';
import SymptomSelector from '@/components/DiseasePrediction/SymptomSelector';
import AnimalTypeSelector from '@/components/DiseasePrediction/AnimalTypeSelector';
import { symptomsList } from '@/data/symptoms';

const PredictorPage: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setPredictionData } = usePrediction();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSymptoms(symptomsList);
    } else {
      const filtered = symptomsList.filter(symptom => 
        symptom.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    }
  }, [searchQuery]);

  const handleAnimalSelect = (animalType: string) => {
    setSelectedAnimal(animalType);
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (!selectedAnimal) {
      setError('Please select an animal type');
      return;
    }

    if (selectedSymptoms.length < 2) {
      setError('Please select at least 2 symptoms');
      return;
    }

    setError(null);
    
    // Save the prediction data to context
    setPredictionData({
      animalType: selectedAnimal,
      symptoms: selectedSymptoms,
      timestamp: new Date().toISOString()
    });
    
    // Navigate to results page
    navigate('/results');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Animal Disease Predictor</h1>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Animal Type</h2>
          <AnimalTypeSelector 
            selectedAnimal={selectedAnimal} 
            onSelect={handleAnimalSelect} 
          />
        </div>
        
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 2: Select Symptoms</h2>
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search symptoms..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {selectedSymptoms.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Symptoms:</h3>
              <div className="flex flex-wrap">
                {selectedSymptoms.map(symptom => (
                  <div 
                    key={symptom}
                    className="symptom-tag-selected flex items-center"
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {symptom}
                    <Check className="ml-1 h-3 w-3" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Symptoms:</h3>
            <div className="flex flex-wrap">
              <SymptomSelector 
                symptoms={filteredSymptoms} 
                selectedSymptoms={selectedSymptoms}
                onToggle={handleSymptomToggle}
              />
            </div>
            
            {filteredSymptoms.length === 0 && (
              <p className="text-gray-500 mt-2">No symptoms match your search</p>
            )}
          </div>
          
          <button 
            className="mt-4 text-sm text-primary hover:underline flex items-center"
            onClick={() => setSearchQuery('')}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> 
            View all symptoms
          </button>
        </div>
        
        {error && (
          <div className="bg-error/10 border border-error/20 text-error rounded-md p-3 mb-4 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={selectedSymptoms.length < 2 || !selectedAnimal}
          >
            Predict Disease
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictorPage;