'use client';

import { CharacterParts } from './CharacterGenerator';

interface CharacterPreviewProps {
  selectedParts: CharacterParts;
}

export default function CharacterPreview({ selectedParts }: CharacterPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Предпросмотр</h2>
      
      <div className="text-center">
        <div className="relative inline-block">
          {/* Контейнер для персонажа */}
          <div className="relative w-96 h-96 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
            <div className="absolute w-full h-full">
              <img
                src={selectedParts.background.imageUrl}
                alt={selectedParts.background.name}
                className="object-cover"
              />
            </div>
            
            <div className="absolute w-full h-full">
              <img
                src={selectedParts.accessory.imageUrl}
                alt={selectedParts.accessory.name}
                className="object-cover"
              />
            </div>
            
            <div className="absolute w-full h-full">
              <img
                src={selectedParts.cloth.imageUrl}
                alt={selectedParts.cloth.name}
                className="object-cover"
              />
            </div>

            <div className="absolute w-full h-full">
              <img
                src={selectedParts.eyes.imageUrl}
                alt={selectedParts.eyes.name}
                className="object-cover"
              />
            </div>

            <div className="absolute w-full h-full">
              <img
                src={selectedParts.cap.imageUrl}
                alt={selectedParts.cap.name}
                className="object-cover"
              />
            </div>

            <div className="absolute w-full h-full">
              <img
                src={selectedParts.beard.imageUrl}
                alt={selectedParts.beard.name}
                className="object-cover"
              />
            </div>

            <div className="absolute w-full h-full">
              <img
                src={selectedParts.mouth.imageUrl}
                alt={selectedParts.mouth.name}
                className="object-cover"
              />
            </div>
            
            {/* Аксессуары */}
            {/* {selectedParts.accessories.map((accessory, index) => (
              <div
                key={accessory.id}
                className="absolute bottom-2"
                style={{ left: `${20 + index * 60}px` }}
              >
                <img
                  src={accessory.imageUrl}
                  alt={accessory.name}
                  className="w-12 h-12 object-cover"
                />
              </div>
            ))} */}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Выбранные части:</p>
          <ul className="mt-2 space-y-1">
            <li>• {selectedParts.accessory.name}</li>
            <li>• {selectedParts.background.name}</li>
            <li>• {selectedParts.beard.name}</li>
            <li>• {selectedParts.cap.name}</li>
            <li>• {selectedParts.cloth.name}</li>
            <li>• {selectedParts.eyes.name}</li>
            <li>• {selectedParts.mouth.name}</li>
            {/* {selectedParts.accessories.map(acc => (
              <li key={acc.id}>• {acc.name}</li>
            ))} */}
          </ul>
        </div>
      </div>
    </div>
  );
} 