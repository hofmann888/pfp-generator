'use client';

import { CharacterPart } from '@/lib/definitions';
import Image from 'next/image';

interface CharacterPreviewProps {
  selectedParts: CharacterPart[];
}

export default function CharacterPreview({ selectedParts }: CharacterPreviewProps) {
  // Sort parts by level to ensure correct layering
  const sortedParts = [...selectedParts].sort((a, b) => {
    const levelA = parseInt(a.id.split('-')[1]);
    const levelB = parseInt(b.id.split('-')[1]);
    return levelA - levelB;
  });

  return (
    <div className="relative w-full h-auto rounded-lg border-2 border-black shadow-[1px_2px_0px_3px_#000] overflow-hidden">
      {sortedParts.map((part, index) => {
        return (
          <div key={part.id} className={`w-full h-full ${!index ? 'relative' : 'absolute top-0'}`} style={{ zIndex: index }}>
            <Image
              src={part.imageUrl}
              alt={part.name}
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