import { DiseaseResult } from '../types';
import { dogDiseases, catDiseases, horseDiseases, cattleDiseases } from '../data/disease';

export const predictDisease = (animalType: string, symptoms: string[]): DiseaseResult[] => {
  let diseasesDataset: DiseaseResult[] = [];
  
  // Select the appropriate dataset based on animal type
  switch (animalType) {
    case 'dog':
      diseasesDataset = [...dogDiseases];
      break;
    case 'cat':
      diseasesDataset = [...catDiseases];
      break;
    case 'horse':
      diseasesDataset = [...horseDiseases];
      break;
    case 'cattle':
      diseasesDataset = [...cattleDiseases];
      break;
    default:
      return [];
  }
  
  // Calculate confidence score for each disease
  const results = diseasesDataset.map(disease => {
    const matchedSymptoms = symptoms.filter(symptom => 
      disease.symptoms.includes(symptom)
    );
    
    // Calculate weighted confidence score
    // More weight given to matching symptoms vs total disease symptoms
    const matchRatio = matchedSymptoms.length / disease.symptoms.length;
    const coverageRatio = matchedSymptoms.length / symptoms.length;
    const confidence = Math.round(((matchRatio * 0.6) + (coverageRatio * 0.4)) * 100);
    
    return {
      ...disease,
      confidence
    };
  });
  
  // Sort by confidence score and filter out low confidence matches
  return results
    .filter(disease => disease.confidence > 30)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3); // Return top 3 matches
}