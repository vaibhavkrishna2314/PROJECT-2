import React from 'react';
import { Check } from 'lucide-react';

interface SymptomSelectorProps {
  symptoms: string[];
  selectedSymptoms: string[];
  onToggle: (symptom: string) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ 
  symptoms, 
  selectedSymptoms, 
  onToggle 
}) => {
  return (
    <>
      {symptoms.map(symptom => (
        <div 
          key={symptom}
          onClick={() => onToggle(symptom)}
          className={`symptom-tag ${selectedSymptoms.includes(symptom) ? 'symptom-tag-selected' : ''}`}
        >
          {symptom}
          {selectedSymptoms.includes(symptom) && (
            <Check className="ml-1 h-3 w-3" />
          )}
        </div>
      ))}
    </>
  );
};

export default SymptomSelector;