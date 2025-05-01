export interface DeliveryOrder {
    id: string;
    restaurantName: string;
    restaurantAddress: string;
    ngoName: string;
    ngoAddress: string;
    restaurantLocation: [number, number];
    ngoLocation: [number, number];
    status: 'pending' | 'accepted' | 'picked' | 'delivered';
  }
  
  export interface DeliveryBoy {
    id: string;
    email: string;
    name: string;
  }
 
  // PredictionData is used to store the data for a prediction request
  // It includes the animal type, symptoms, and timestamp of the request
  export interface PredictionData {
    animalType: string;
    symptoms: string[];
    timestamp: string;
  }
  
  export interface DiseaseResult {
    disease: string;
    confidence: number;
    description: string;
    symptoms: string[];
  }
  
  export interface HistoryItem {
    id: string;
    animalType: string;
    symptoms: string[];
    results: DiseaseResult[];
    timestamp: string;
  }