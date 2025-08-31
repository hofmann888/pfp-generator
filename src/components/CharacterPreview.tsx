'use client';

import { CharacterParts } from './CharacterGenerator';
import Image from 'next/image';

interface CharacterPreviewProps {
  selectedParts: CharacterParts;
}

export default function CharacterPreview({ selectedParts }: CharacterPreviewProps) {
  return (
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
  );
} 