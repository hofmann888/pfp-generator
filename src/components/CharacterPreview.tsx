'use client';

import { CharacterParts } from './CharacterGenerator';

interface CharacterPreviewProps {
  selectedParts: CharacterParts;
  isGenerating: boolean;
  generate: () => void,
}

export default function CharacterPreview({ selectedParts, isGenerating, generate }: CharacterPreviewProps) {
  return (
    <div className="text-center">
      <div className="relative inline-block w-full">
        {/* Контейнер для персонажа */}
        <div className="relative w-full h-96 rounded-lg border-2 border-black shadow-[1px_2px_0px_3px_#000] overflow-hidden">
          <div className="absolute w-full h-full">
            <img
              src={selectedParts.background.imageUrl}
              alt={selectedParts.background.name}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="absolute w-full h-full">
            <img
              src={selectedParts.accessory.imageUrl}
              alt={selectedParts.accessory.name}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="absolute w-full h-full">
            <img
              src={selectedParts.cloth.imageUrl}
              alt={selectedParts.cloth.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <img
              src={selectedParts.eyes.imageUrl}
              alt={selectedParts.eyes.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <img
              src={selectedParts.cap.imageUrl}
              alt={selectedParts.cap.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <img
              src={selectedParts.beard.imageUrl}
              alt={selectedParts.beard.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <img
              src={selectedParts.mouth.imageUrl}
              alt={selectedParts.mouth.name}
              className="object-cover w-full h-full"
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

      <button
        onClick={generate}
        disabled={isGenerating}
        className="w-full mt-4 py-3 px-6 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] uppercase text-white text-shadow-contur"
      >
        {isGenerating ? 'Generating...' : 'Download your pfp'}
      </button>
      
      {/* <div className="mt-4 text-sm text-gray-600">
        <p>Выбранные части:</p>
        <ul className="mt-2 space-y-1">
          <li>• {selectedParts.accessory.name}</li>
          <li>• {selectedParts.background.name}</li>
          <li>• {selectedParts.beard.name}</li>
          <li>• {selectedParts.cap.name}</li>
          <li>• {selectedParts.cloth.name}</li>
          <li>• {selectedParts.eyes.name}</li>
          <li>• {selectedParts.mouth.name}</li>
        </ul>
      </div> */}
    </div>
  );
} 