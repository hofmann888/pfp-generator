import Image from 'next/image';

interface CategorySelectorProps {
  activeCategory: string,
  activeCategoryIdx: number;
  switchCategoryIdx: (idx: number) => void,
}

export default function CategorySelector({ activeCategory, activeCategoryIdx, switchCategoryIdx }: CategorySelectorProps) {
  return (
    <div className="flex justify-between gap-4 max-md:mt-5">
      <button 
        className="p-3 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] cursor-pointer"
        onClick={() => switchCategoryIdx(activeCategoryIdx - 1)}
      >
        <Image src="/img/arrow.png" alt="arrow" width={33} height={20} className="rotate-y-180 min-w-[33px]" />
      </button>

      <div className="w-full px-6 py-3 rounded-2xl bg-[#00F2FE] border-2 border-black shadow-[2px_4px_0px_0px_#000] overflow-hidden uppercase text-center text-xl">
        {activeCategory}
      </div>

      <button 
        className="p-3 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] cursor-pointer"
        onClick={() => switchCategoryIdx(activeCategoryIdx + 1)}
      >
        <Image src="/img/arrow.png" alt="arrow" width={33} height={20} className="min-w-[33px]" />
      </button>
    </div>
  )
}