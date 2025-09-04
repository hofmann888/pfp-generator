'use client';

import Image from 'next/image';

interface NavigationSelectorProps<T> {
  className?: string;
  items: T[];
  selectedItem: T;
  onItemSelect: (item: T) => void;
  getItemLabel: (item: T) => string;
}

export default function NavigationSelector<T>({
  className,
  items,
  selectedItem,
  onItemSelect,
  getItemLabel,
}: NavigationSelectorProps<T>) {
  const currentIndex = items.findIndex(item => item === selectedItem);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onItemSelect(items[currentIndex - 1]);
    } else {
      onItemSelect(items[items.length - 1]); // Loop to last item
    }
  };
  
  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onItemSelect(items[currentIndex + 1]);
    } else {
      onItemSelect(items[0]); // Loop to first item
    }
  };

  return (
    <div className={`flex justify-between gap-14 max-2xl:gap-8 max-lg:gap-4 ${className} min-h-[80px] max-lg:min-h-[45px] max-md:min-h-[56px]`}>
      {/* Previous button */}
      <button 
        className="p-3 max-lg:p-3 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] cursor-pointer"
        onClick={handlePrevious}
        disabled={items.length <= 1}
      >
        <Image src="/img/arrow.png" alt="arrow" width={33} height={20} className="rotate-y-180 min-w-[52px] max-lg:min-w-[33px]" />
      </button>
      
      
      {/* Center text */}
      <div className="flex items-center justify-center w-full rounded-2xl bg-[#00F2FE] border-2 border-black shadow-[2px_4px_0px_0px_#000] overflow-hidden uppercase text-center text-xl">
        {getItemLabel(selectedItem)}
      </div>
      
      {/* Next button */}
      <button 
        className="p-3 max-lg:p-3 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] cursor-pointer"
        onClick={handleNext}
        disabled={items.length <= 1}
      >
        <Image src="/img/arrow.png" alt="arrow" width={33} height={20} className="min-w-[52px] max-lg:min-w-[33px]" />
      </button>
    </div>
  );
}
