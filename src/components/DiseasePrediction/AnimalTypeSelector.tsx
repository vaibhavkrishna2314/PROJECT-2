import React from 'react';
import { Check } from 'lucide-react';

interface AnimalTypeSelectorProps {
  selectedAnimal: string;
  onSelect: (animalType: string) => void;
}

const AnimalTypeSelector: React.FC<AnimalTypeSelectorProps> = ({ selectedAnimal, onSelect }) => {
  const animalTypes = [
    { 
      id: 'dog', 
      name: 'Dog',
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 'cat', 
      name: 'Cat',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 'horse', 
      name: 'Horse',
      image: 'https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    { 
      id: 'cattle', 
      name: 'Cattle',
      image: 'https://images.pexels.com/photos/735968/pexels-photo-735968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {animalTypes.map((animal) => (
        <div
          key={animal.id}
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105 border-2 ${
            selectedAnimal === animal.id
              ? 'border-primary shadow-md'
              : 'border-transparent hover:border-gray-200'
          }`}
          onClick={() => onSelect(animal.id)}
        >
          <div className="aspect-square relative">
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-20"></div>
            {selectedAnimal === animal.id && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="p-2 text-center font-medium">{animal.name}</div>
        </div>
      ))}
    </div>
  );
};

export default AnimalTypeSelector;