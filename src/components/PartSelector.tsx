'use client';

import { CharacterPart } from './CharacterGenerator';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

interface PartSelectorProps {
  activeCategoryData: any;
  selectedByCategory: any,
  setSelection: (categoryName: string, part: CharacterPart) => void;
}

export default function PartSelector({ activeCategoryData, setSelection, selectedByCategory }: PartSelectorProps) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: true });

  function sortRarities(rarities: Record<string, CharacterPart[]>) {
    const priority: Record<string, number> = { common: 1, rare: 2, epic: 3, legendary: 4, mythical: 5 };
    return Object.keys(rarities).sort((a, b) => (priority[a] || 999) - (priority[b] || 999));
  };

  return (
    <div className="embla rounded-xl p-3 mt-5 bg-[#F0FF6B] border-2 border-black shadow-[1px_2px_0px_3px_#000]">
      <div className="overflow-hidden p-[4px_2px]" ref={emblaRef}>
        <div className="embla__container flex items-center">
          {sortRarities(activeCategoryData.rarities).map(rarity => 
            activeCategoryData.rarities[rarity].map((part: any) => {
              const isSelected = selectedByCategory[activeCategoryData.category]?.id === part.id;
              return (
                <div key={part.id} className={`embla__slide ${isSelected ? 'flex-[0_0_28%]' : 'flex-[0_0_24%]'}`}>
                  <div
                    className={`border-1 border-black rounded-2xl shadow-[1px_2px_0px_1px_#000] cursor-pointer ${isSelected ? 'border-3' : 'border-1'}`}
                    onClick={() => setSelection(activeCategoryData.category, part)}
                  >
                    <Image
                      src={part.imageUrl}
                      alt={part.name}
                      width={73}
                      height={73}
                      className="w-full h-full object-cover rounded-2xl mb-[-1px] bg-white"
                    />
                  </div>
                </div>
              );
            }
          ))}
        </div>
      </div>
    </div>
  );
} 