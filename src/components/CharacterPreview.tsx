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
        <div className="relative w-full h-[358px] rounded-lg border-2 border-black shadow-[1px_2px_0px_3px_#000] overflow-hidden">
          {Object.keys(selectedParts).map((key: any) => {
            return (
              <div key={key} className="absolute w-full h-full">
                <Image
                  src={selectedParts[key as keyof CharacterParts].imageUrl}
                  alt={selectedParts[key as keyof CharacterParts].name}
                  width={358}
                  height={358}
                  className="object-cover w-full h-full"
                />
              </div>
            )
          })}
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