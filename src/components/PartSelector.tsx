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
      <div className="embla min-md:hidden rounded-xl p-3 mt-5 bg-[#F0FF6B] border-2 border-black shadow-[1px_2px_0px_3px_#000]">
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
                      width={73}
                      height={73}
                      className={`w-full h-full object-cover mb-[-1px] bg-white ${isSelected ? 'rounded-xl' : 'rounded-2xl'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-md:hidden h-full rounded-xl py-4 max-lg:py-5 px-8 max-lg:px-6 mt-5 bg-[#F0FF6B] border-2 border-black shadow-[1px_2px_0px_3px_#000] max-h-[500px] min-[2350px]:px-28">
        {/* <div className="overflow-hidden p-[4px_2px]"> */}
          <div className="flex flex-wrap content-start overflow-auto h-full max-lg:h-[200px] max-[900px]:h-[148px!important]">
            {parts.map((part) => {
              const isSelected = selectedPart?.id === part.id;
              return (
                <div key={part.id} className={`flex items-center flex-[0_0_20%] max-lg:flex-[0_0_25%] ${isSelected ? 'p-[1px]' : 'p-2'}`}>
                  <div
                    className={`border-1 border-black rounded-2xl shadow-[1px_2px_0px_1px_#000] cursor-pointer ${isSelected ? 'border-3' : 'border-1'}`}
                    onClick={() => onPartSelect(part)}
                  >
                    <Image
                      src={part.imageUrl}
                      alt={part.name}
                      width={73}
                      height={73}
                      className={`w-full h-full object-cover mb-[-1px] bg-white ${isSelected ? 'rounded-xl' : 'rounded-2xl'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        {/* </div> */}
      </div>
    </>
  );
} 