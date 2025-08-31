'use client';

import { useState, useRef, useEffect } from 'react';
import CharacterPreview from './CharacterPreview';
import CategorySelector from './CategorySelector';
import PartSelector from './PartSelector';

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
}

interface CategoryAssets {
  category: string;
  rarities: Record<string, CharacterPart[]>;
}

export default function CharacterGenerator() {
  const [assets, setAssets] = useState<CategoryAssets[]>([]);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [selectedByCategory, setSelectedByCategory] = useState<Record<string, CharacterPart | undefined>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawOrder: Array<keyof CharacterParts> = [
    'background', 'accessory', 'cloth', 'eyes', 'cap', 'beard', 'mouth',
  ];

  // Fetch assets on mount
  useEffect(() => {
    async function fetchAssets() {
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
  }, [assets, activeCategoryIdx]);

  function getFirstItem(category: CategoryAssets): CharacterPart | undefined {
    const rarityPriority: Record<string, number> = { legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 };
    const keys = Object.keys(category.rarities).sort((a, b) => (rarityPriority[a] || 999) - (rarityPriority[b] || 999));
    for (const r of keys) {
      const items = category.rarities[r];
      if (items && items.length > 0) return items[0];
    }
    return undefined;
  };

  function getSelectedOrFirst(categoryName: string): CharacterPart {
    const selected = selectedByCategory[categoryName];
    if (selected) return selected;
    const cat = assets.find(c => c.category === categoryName);
    const first = cat ? getFirstItem(cat) : undefined;
    // Fallback empty part to satisfy types if assets missing
    return first || { id: `${categoryName}-none`, name: 'none', imageUrl: '' };
  };

  function setSelection(categoryName: string, part: CharacterPart) {
    setSelectedByCategory(prev => ({ ...prev, [categoryName]: part }));
  };

  function switchCategoryIdx(idx: number) {
    if (idx < 0 || idx >= assets.length) return;
    setActiveCategoryIdx(idx);
  }

  const selectedForPreview: CharacterParts = {
    background: getSelectedOrFirst('background'),
    accessory: getSelectedOrFirst('accessory'),
    cloth: getSelectedOrFirst('cloth'),
    eyes: getSelectedOrFirst('eyes'),
    cap: getSelectedOrFirst('cap'),
    beard: getSelectedOrFirst('beard'),
    mouth: getSelectedOrFirst('mouth'),
  };

  async function generateCharacter() {
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
          console.error(`Image download error for ${part?.name}:`, error);
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      downloadCharacter(dataUrl);
    } catch (error) {
      console.error('Character generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  function downloadCharacter(generatedImage: string) {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = 'character.png';
    link.href = generatedImage;
    link.click();
  };

  const activeCategoryData = assets[activeCategoryIdx];

  return activeCategoryData && (
    <div className="flex gap-8 max-md:gap-0 max-md:flex-col">
      <div className="w-1/2 max-md:w-full">
        <CharacterPreview selectedParts={selectedForPreview} />

        <button
          onClick={generateCharacter}
          disabled={isGenerating}
          className="w-full mt-4 py-3 px-6 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] uppercase text-white text-shadow-contur cursor-pointer"
        >
          {isGenerating ? 'Generating...' : 'Download your pfp'}
        </button>
      </div>

      <div className="w-1/2 max-md:w-full">
        <CategorySelector 
          activeCategory={assets[activeCategoryIdx].category}
          activeCategoryIdx={activeCategoryIdx}
          switchCategoryIdx={switchCategoryIdx}
        />
        
        <PartSelector 
          activeCategoryData={activeCategoryData} 
          selectedByCategory={selectedByCategory}
          setSelection={setSelection}
        />
      </div>

      <canvas
        ref={canvasRef}
        className="hidden"
        width={1440}
        height={1440}
      />
    </div>
  );
} 