import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PredictionData, HistoryItem } from '../types';

interface PredictionContextType {
  predictionData: PredictionData | null;
  setPredictionData: (data: PredictionData) => void;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => {
      // Check if a prediction with the same symptoms and animal type exists within the last minute
      const now = new Date(item.timestamp).getTime();
      const isDuplicate = prev.some(historyItem => {
        const itemTime = new Date(historyItem.timestamp).getTime();
        const timeDiff = Math.abs(now - itemTime) < 60000; // Within 1 minute
        const sameAnimal = historyItem.animalType === item.animalType;
        const sameSymptoms = 
          historyItem.symptoms.length === item.symptoms.length &&
          historyItem.symptoms.every(s => item.symptoms.includes(s));
        
        return timeDiff && sameAnimal && sameSymptoms;
      });

      if (isDuplicate) {
        return prev;
      }

      return [item, ...prev];
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <PredictionContext.Provider
      value={{
        predictionData,
        setPredictionData,
        history,
        addToHistory,
        removeFromHistory,
        clearHistory
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};