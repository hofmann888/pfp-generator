'use client';

import { CharacterParts } from './CharacterGenerator';
import Image from 'next/image';

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
        <div className="relative w-full h-[358px] rounded-lg border-2 border-black shadow-[1px_2px_0px_3px_#000] overflow-hidden">
          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.background.imageUrl}
              alt={selectedParts.background.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.accessory.imageUrl}
              alt={selectedParts.accessory.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.cloth.imageUrl}
              alt={selectedParts.cloth.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.eyes.imageUrl}
              alt={selectedParts.eyes.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.cap.imageUrl}
              alt={selectedParts.cap.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.beard.imageUrl}
              alt={selectedParts.beard.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="absolute w-full h-full">
            <Image
              src={selectedParts.mouth.imageUrl}
              alt={selectedParts.mouth.name}
              width={358}
              height={358}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={isGenerating}
        className="w-full mt-4 py-3 px-6 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] uppercase text-white text-shadow-contur"
      >
        {isGenerating ? 'Generating...' : 'Download your pfp'}
      </button>
    </div>
  );
} 