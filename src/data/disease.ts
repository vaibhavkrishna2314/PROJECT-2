import { DiseaseResult } from '../types';

// Dog diseases dataset
export const dogDiseases: DiseaseResult[] = [
  {
    disease: 'Canine Parvovirus',
    confidence: 0,
    description: 'A highly contagious viral disease affecting dogs, especially puppies. It attacks the gastrointestinal tract and immune system.',
    symptoms: ['Vomiting', 'Diarrhea', 'Lethargy', 'Loss of appetite', 'Fever', 'Bloody stool']
  },
  {
    disease: 'Canine Distemper',
    confidence: 0,
    description: 'A contagious viral disease affecting a dog\'s respiratory, gastrointestinal, and nervous systems.',
    symptoms: ['Coughing', 'Sneezing', 'Eye discharge', 'Nasal discharge', 'Lethargy', 'Fever', 'Seizures']
  },
  {
    disease: 'Kennel Cough',
    confidence: 0,
    description: 'A highly contagious respiratory disease affecting dogs, similar to a cold in humans.',
    symptoms: ['Coughing', 'Sneezing', 'Nasal discharge', 'Lethargy', 'Loss of appetite']
  },
  {
    disease: 'Canine Arthritis',
    confidence: 0,
    description: 'A degenerative joint disease causing inflammation and pain in dogs, especially in older animals.',
    symptoms: ['Limping', 'Stiffness', 'Difficulty walking', 'Decreased activity', 'Pain', 'Reluctance to move']
  },
  {
    disease: 'Diabetes Mellitus',
    confidence: 0,
    description: 'A metabolic disorder affecting a dog\'s blood sugar regulation.',
    symptoms: ['Increased thirst', 'Frequent urination', 'Weight loss', 'Increased appetite', 'Lethargy']
  }
];

// Cat diseases dataset
export const catDiseases: DiseaseResult[] = [
  {
    disease: 'Feline Leukemia Virus (FeLV)',
    confidence: 0,
    description: 'A viral infection that weakens the immune system in cats, making them susceptible to other diseases.',
    symptoms: ['Weight loss', 'Poor coat condition', 'Lethargy', 'Loss of appetite', 'Fever', 'Pale gums']
  },
  {
    disease: 'Feline Immunodeficiency Virus (FIV)',
    confidence: 0,
    description: 'A viral infection that affects the immune system of cats, similar to HIV in humans.',
    symptoms: ['Weight loss', 'Poor coat condition', 'Fever', 'Lethargy', 'Recurring infections']
  },
  {
    disease: 'Feline Lower Urinary Tract Disease (FLUTD)',
    confidence: 0,
    description: 'A group of conditions affecting a cat\'s bladder and urethra.',
    symptoms: ['Frequent urination', 'Blood in urine', 'Difficulty urinating', 'Excessive licking', 'Pain']
  },
  {
    disease: 'Hyperthyroidism',
    confidence: 0,
    description: 'An overproduction of thyroid hormones in cats, typically due to a benign tumor.',
    symptoms: ['Weight loss', 'Increased appetite', 'Increased thirst', 'Hyperactivity', 'Poor coat condition']
  },
  {
    disease: 'Feline Respiratory Infection',
    confidence: 0,
    description: 'A group of contagious viral and bacterial infections affecting a cat\'s respiratory system.',
    symptoms: ['Sneezing', 'Coughing', 'Eye discharge', 'Nasal discharge', 'Lethargy', 'Loss of appetite']
  }
];

// Horse diseases dataset
export const horseDiseases: DiseaseResult[] = [
  {
    disease: 'Equine Colic',
    confidence: 0,
    description: 'A digestive disorder causing abdominal pain in horses, varying from mild to severe.',
    symptoms: ['Pawing at ground', 'Rolling', 'Looking at flanks', 'Sweating', 'Loss of appetite', 'Bloating']
  },
  {
    disease: 'Equine Influenza',
    confidence: 0,
    description: 'A highly contagious respiratory virus affecting horses.',
    symptoms: ['Coughing', 'Nasal discharge', 'Fever', 'Lethargy', 'Loss of appetite']
  },
  {
    disease: 'Laminitis',
    confidence: 0,
    description: 'Inflammation of the sensitive laminae in a horse\'s hooves, causing severe pain and lameness.',
    symptoms: ['Lameness', 'Pain', 'Reluctance to move', 'Heat in hooves', 'Increased digital pulse']
  },
  {
    disease: 'Strangles',
    confidence: 0,
    description: 'A bacterial infection affecting a horse\'s upper respiratory tract and lymph nodes.',
    symptoms: ['Nasal discharge', 'Swelling', 'Fever', 'Coughing', 'Difficulty swallowing']
  },
  {
    disease: 'Equine Protozoal Myeloencephalitis (EPM)',
    confidence: 0,
    description: 'A neurological disease caused by parasites affecting a horse\'s central nervous system.',
    symptoms: ['Lameness', 'Disorientation', 'Loss of balance', 'Difficulty walking', 'Lethargy']
  }
];

// Cattle diseases dataset
export const cattleDiseases: DiseaseResult[] = [
  {
    disease: 'Foot and Mouth Disease',
    confidence: 0,
    description: 'A highly contagious viral disease affecting cloven-hoofed animals, particularly cattle.',
    symptoms: ['Fever', 'Blisters on mouth and feet', 'Excessive salivation', 'Loss of appetite', 'Lameness']
  },
  {
    disease: 'Bovine Respiratory Disease (BRD)',
    confidence: 0,
    description: 'A complex of respiratory diseases affecting cattle, commonly called shipping fever.',
    symptoms: ['Coughing', 'Nasal discharge', 'Difficulty breathing', 'Fever', 'Lethargy', 'Loss of appetite']
  },
  {
    disease: 'Mastitis',
    confidence: 0,
    description: 'Inflammation of the mammary gland/udder in dairy cows, usually due to bacterial infection.',
    symptoms: ['Swelling', 'Redness', 'Pain', 'Heat in udder', 'Abnormal milk']
  },
  {
    disease: 'Bovine Viral Diarrhea (BVD)',
    confidence: 0,
    description: 'A viral disease affecting cattle\'s digestive, reproductive, and respiratory systems.',
    symptoms: ['Diarrhea', 'Fever', 'Loss of appetite', 'Nasal discharge', 'Weight loss']
  },
  {
    disease: 'Blackleg',
    confidence: 0,
    description: 'A bacterial disease affecting cattle, causing inflammation and swelling in muscles.',
    symptoms: ['Swelling', 'Lameness', 'Fever', 'Depression', 'Loss of appetite']
  }
];