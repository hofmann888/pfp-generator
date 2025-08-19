'use client';

import { useState, useRef, useEffect } from 'react';
import CharacterPreview from './CharacterPreview';

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
  const [selectedByCategory, setSelectedByCategory] = useState<Record<string, CharacterPart | undefined>>({});

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error('Ошибка генерации персонажа:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCharacter = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = 'character.png';
    link.href = generatedImage;
    link.click();
  };

  const sortRarities = (rarities: Record<string, CharacterPart[]>) => {
    const priority: Record<string, number> = { legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 };
    return Object.keys(rarities).sort((a, b) => (priority[a] || 999) - (priority[b] || 999));
  };

  const activeCategoryData = activeCategory ? assets.find(c => c.category === activeCategory) : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Левая панель - выбор частей */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Выберите части персонажа</h2>

          <div className="flex flex-wrap gap-2 text-gray-800 mb-4">
            {assets.map(cat => {
              const isActive = cat.category === activeCategory;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveCategory(cat.category)}
                  className={`rounded-lg border-2 px-3 py-1 cursor-pointer transition-colors ${
                    isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat.category}
                </button>
              );
            })}
          </div>

          {activeCategoryData ? (
            <div className="space-y-4">
              {sortRarities(activeCategoryData.rarities).map(rarity => (
                <div key={rarity} className="">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 capitalize">{rarity}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activeCategoryData.rarities[rarity].map((part) => {
                      const isSelected = selectedByCategory[activeCategoryData.category]?.id === part.id;
                      return (
                        <div
                          key={part.id}
                          className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelection(activeCategoryData.category, part)}
                        >
                          <img
                            src={part.imageUrl}
                            alt={part.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute top-1 right-1">
                            {isSelected && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          {/* <p className="text-xs text-center p-2 text-gray-600">{part.name}</p> */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Нет доступных ассетов.</p>
          )}

          <button
            onClick={generateCharacter}
            disabled={isGenerating}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Правая панель - предпросмотр и результат */}
      <div className="space-y-6">
        <CharacterPreview selectedParts={selectedForPreview} />
        
        {generatedImage && (
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
        )}
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