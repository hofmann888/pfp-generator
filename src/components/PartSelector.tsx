'use client';

import { CharacterPart } from '@/lib/definitions';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

interface PartSelectorProps {
  parts: CharacterPart[];
  selectedPart: CharacterPart | null;
  onPartSelect: (part: CharacterPart) => void;
}

export default function PartSelector({ parts, selectedPart, onPartSelect }: PartSelectorProps) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: true });

  return (
    <>
      <div className="embla min-md:hidden rounded-xl p-3 bg-[#F0FF6B] border-2 border-black shadow-[1px_2px_0px_3px_#000]">
        <div className="overflow-hidden py-1 mx-5 max-md:mx-0" ref={emblaRef}>
          <div className="embla__container flex items-center">
            {parts.map((part) => {
              const isSelected = selectedPart?.id === part.id;
              return (
                <div key={part.id} className={`embla__slide ${isSelected ? 'flex-[0_0_27%]' : 'flex-[0_0_24%]'}`}>
                  <div
                    className={`border-1 border-black rounded-2xl shadow-[1px_2px_0px_1px_#000] cursor-pointer ${isSelected ? 'border-3' : 'border-1'}`}
                    onClick={() => onPartSelect(part)}
                  >
                    <Image
                      src={part.imageUrl}
                      alt={part.name}
                      width={358}
                      height={358}
                      className={`w-full h-full object-cover mb-[-1px] bg-white ${isSelected ? 'rounded-xl' : 'rounded-2xl'}`}
                      priority
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center max-md:hidden h-auto rounded-xl py-4 max-lg:py-5 px-8 max-lg:px-5 bg-[#F0FF6B] border-2 border-black shadow-[1px_2px_0px_3px_#000] max-h-[500px]">
          <div className="flex flex-wrap content-start overflow-auto scroll-visible h-[359px] max-2xl:h-[302px!important] max-xl:h-[231px!important] max-lg:h-[153px!important] w-[600px] max-2xl:w-[505px] max-xl:w-[387px] max-lg:w-[308px] max-[800px]:w-auto">
            {parts.map((part) => {
              const isSelected = selectedPart?.id === part.id;
              return (
                <div key={part.id} className={`flex items-center flex-[0_0_20%] max-lg:flex-[0_0_25%] ${isSelected ? 'p-[1px]' : 'p-2 max-xl:p-1.5'}`}>
                  <div
                    className={`border-1 border-black rounded-2xl max-2xl:rounded-[10px] shadow-[1px_2px_0px_1px_#000] cursor-pointer ${isSelected ? 'border-3' : 'border-1'}`}
                    onClick={() => onPartSelect(part)}
                  >
                    <Image
                      src={part.imageUrl}
                      alt={part.name}
                      width={358}
                      height={358}
                      className={`w-full h-full object-cover mb-[-1px] bg-white ${isSelected ? 'rounded-xl max-2xl:rounded-[7px]' : 'rounded-2xl max-2xl:rounded-[10px]'}`}
                      priority
                    />
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </>
  );
} 