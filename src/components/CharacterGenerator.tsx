'use client';

import { useState, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import CharacterPreview from './CharacterPreview';
import CategorySelector from './CategorySelector';

export interface CharacterPart {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CharacterParts {
  accessory: CharacterPart;
  background: CharacterPart;
  beard: CharacterPart;
  cap: CharacterPart;
  cloth: CharacterPart;
  eyes: CharacterPart;
  mouth: CharacterPart;
  // accessories: CharacterPart[];
}

interface CategoryAssets {
  category: string;
  rarities: Record<string, CharacterPart[]>;
}

export default function CharacterGenerator() {
  const [assets, setAssets] = useState<CategoryAssets[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [selectedByCategory, setSelectedByCategory] = useState<Record<string, CharacterPart | undefined>>({});

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });

  // const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawOrder: Array<keyof CharacterParts> = [
    'background',
    'accessory',
    'cloth',
    'eyes',
    'cap',
    'beard',
    'mouth',
  ];

  // Fetch assets on mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/assets', { cache: 'no-store' });
        const data: { categories: CategoryAssets[] } = await res.json();
        setAssets(data.categories);
      } catch (e) {
        console.error('Failed to load assets', e);
      }
    };

    fetchAssets();
  }, []);

  // Initialize activeCategory and defaults once assets are loaded
  useEffect(() => {
    if (assets.length === 0) return;

    if (!activeCategory) {
      setActiveCategory(assets[0].category);
    }

    setSelectedByCategory(prev => {
      const next = { ...prev } as Record<string, CharacterPart | undefined>;
      for (const c of assets) {
        if (!next[c.category]) {
          const first = getFirstItem(c);
          if (first) next[c.category] = first;
        }
      }
      return next;
    });
  }, [assets, activeCategory]);

  const getFirstItem = (category: CategoryAssets): CharacterPart | undefined => {
    const rarityPriority: Record<string, number> = { legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 };
    const keys = Object.keys(category.rarities).sort((a, b) => (rarityPriority[a] || 999) - (rarityPriority[b] || 999));
    for (const r of keys) {
      const items = category.rarities[r];
      if (items && items.length > 0) return items[0];
    }
    return undefined;
  };

  const getSelectedOrFirst = (categoryName: string): CharacterPart => {
    const selected = selectedByCategory[categoryName];
    if (selected) return selected;
    const cat = assets.find(c => c.category === categoryName);
    const first = cat ? getFirstItem(cat) : undefined;
    // Fallback empty part to satisfy types if assets missing
    return first || { id: `${categoryName}-none`, name: 'none', imageUrl: '' };
  };

  const setSelection = (categoryName: string, part: CharacterPart) => {
    setSelectedByCategory(prev => ({ ...prev, [categoryName]: part }));
  };

  const selectedForPreview: CharacterParts = {
    background: getSelectedOrFirst('background'),
    accessory: getSelectedOrFirst('accessory'),
    cloth: getSelectedOrFirst('cloth'),
    eyes: getSelectedOrFirst('eyes'),
    cap: getSelectedOrFirst('cap'),
    beard: getSelectedOrFirst('beard'),
    mouth: getSelectedOrFirst('mouth'),
  };

  const generateCharacter = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 1440;
      canvas.height = 1440;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      const orderedParts = drawOrder.map(key => ({ part: selectedForPreview[key], x: 0, y: 0 }));

      for (const { part, x, y } of orderedParts) {
        try {
          if (!part || !part.imageUrl) continue;
          const img = await loadImage(part.imageUrl);
          ctx.drawImage(img, x, y);
        } catch (error) {
          console.error(`Ошибка загрузки изображения для ${part?.name}:`, error);
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      // setGeneratedImage(dataUrl);
      downloadCharacter(dataUrl);
    } catch (error) {
      console.error('Ошибка генерации персонажа:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCharacter = (generatedImage: string) => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = 'character.png';
    link.href = generatedImage;
    link.click();
  };

  const sortRarities = (rarities: Record<string, CharacterPart[]>) => {
    const priority: Record<string, number> = { common: 1, rare: 2, epic: 3, legendary: 4, mythical: 5 };
    return Object.keys(rarities).sort((a, b) => (priority[a] || 999) - (priority[b] || 999));
  };

  const activeCategoryData = activeCategory ? assets.find(c => c.category === activeCategory) : undefined;



  console.log('assets', assets);
  console.log('activeCategoryData', activeCategoryData);

  function switchCategoryIdx(idx: number) {
    if (idx < 0 || idx >= assets.length) return;
    setActiveCategoryIdx(idx);
    setActiveCategory(assets[idx].category);
  }

  

  return (
    <div className="flex gap-8 max-md:gap-0 max-md:flex-col-reverse">
      {/* Левая панель - выбор частей */}
      {activeCategoryData && (
        <div className="w-1/2 max-md:w-full">
          <div className="rounded-lg shadow-lg">
            {/* <CategorySelector /> */}
            <div className="flex justify-between gap-4 max-md:mt-5">
              <button 
                className="p-3 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000]"
                onClick={() => switchCategoryIdx(activeCategoryIdx - 1)}
              >
                <img src="/img/arrow.png" alt="arrow" className="rotate-y-180" />
              </button>

              <div className="w-full px-6 py-3 rounded-2xl bg-[#00F2FE] border-2 border-black shadow-[2px_4px_0px_0px_#000] overflow-hidden uppercase text-center text-xl">
                {assets[activeCategoryIdx].category}
              </div>

              <button 
                className="p-3 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000]"
                onClick={() => switchCategoryIdx(activeCategoryIdx + 1)}
              >
                <img src="/img/arrow.png" alt="arrow" />
              </button>
            </div>

            <div className="embla rounded-xl p-3 mt-5 bg-[#F0FF6B] border-2 border-black shadow-[1px_2px_0px_3px_#000]">
              <div className="overflow-hidden p-[4px_2px]" ref={emblaRef}>
                <div className="embla__container flex items-center">
                  {sortRarities(activeCategoryData.rarities).map(rarity => 
                    activeCategoryData.rarities[rarity].map((part) => {
                      const isSelected = selectedByCategory[activeCategoryData.category]?.id === part.id;
                      return (
                        <div key={part.id} className={`embla__slide ${isSelected ? 'flex-[0_0_28%]' : 'flex-[0_0_24%]'}`}>
                          <div
                            className={`border-1 border-black rounded-2xl shadow-[1px_2px_0px_1px_#000] ${isSelected ? 'border-3' : 'border-1'}`}
                            onClick={() => setSelection(activeCategoryData.category, part)}
                          >
                            <img
                              src={part.imageUrl}
                              alt={part.name}
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
          </div>
        </div>
      )}

      {/* Правая панель - предпросмотр и результат */}
      <div className="w-1/2 max-md:w-full">
        {activeCategoryData && <CharacterPreview selectedParts={selectedForPreview} isGenerating={isGenerating} generate={generateCharacter} />}
        
        {/* {generatedImage && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Результат</h3>
            <div className="text-center">
              <img
                src={generatedImage}
                alt="Сгенерированный персонаж"
                className="mx-auto border-2 border-gray-200 rounded-lg"
              />
              <button
                onClick={downloadCharacter}
                className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                💾 Download
              </button>
            </div>
          </div>
        )} */}
      </div>

      {/* Скрытый canvas для генерации изображения */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width={1440}
        height={1440}
      />
    </div>
  );
} 