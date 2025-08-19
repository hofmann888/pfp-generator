'use client';

import { useState, useRef, useEffect } from 'react';
import PartSelector from './PartSelector';
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

const AVAILABLE_PARTS = {
  accessory: [
    { id: 'accessory1', name: 'Аксессуар 1', imageUrl: '/img/accessory/common/axe.png' },
    { id: 'accessory2', name: 'Аксессуар 2', imageUrl: '/img/accessory/common/gun.png' },
    { id: 'accessory3', name: 'Аксессуар 3', imageUrl: '/img/accessory/common/spear.png' },
    { id: 'accessory4', name: 'Аксессуар 4', imageUrl: '/img/accessory/common/sword.png' },
  ],
  background: [
    { id: 'background1', name: 'Фон 1', imageUrl: '/img/background/common/blue.png' },
    { id: 'background2', name: 'Фон 2', imageUrl: '/img/background/common/green.png' },
    { id: 'background3', name: 'Фон 3', imageUrl: '/img/background/common/lime.png' },
    { id: 'background4', name: 'Фон 4', imageUrl: '/img/background/common/orange.png' },
  ],
  beard: [
    { id: 'beard1', name: 'Борода 1', imageUrl: '/img/beard/common/curly_yellow.png' },
    { id: 'beard2', name: 'Борода 2', imageUrl: '/img/beard/common/gray.png' },
    { id: 'beard3', name: 'Борода 3', imageUrl: '/img/beard/common/red_curls.png' },
  ],
  cap: [
    { id: 'head1', name: 'Голова 1', imageUrl: '/img/cap/common/bandana.png' },
    { id: 'head2', name: 'Голова 2', imageUrl: '/img/cap/common/cap_maga.png' },
    { id: 'head3', name: 'Голова 3', imageUrl: '/img/cap/common/godfather.png' },
    { id: 'head4', name: 'Голова 4', imageUrl: '/img/cap/common/joker.png' },
  ],
  cloth: [
    { id: 'body1', name: 'Тело 1', imageUrl: '/img/cloth/legendary/akatsuki_kimono.png' },
    { id: 'body2', name: 'Тело 2', imageUrl: '/img/cloth/legendary/android_costume.png' },
    { id: 'body3', name: 'Тело 3', imageUrl: '/img/cloth/legendary/dragonball.png' },
    { id: 'body4', name: 'Тело 4', imageUrl: '/img/cloth/legendary/jacket_joker.png' },
  ],
  eyes: [
    { id: 'eyes1', name: 'Глаза 1', imageUrl: '/img/eyes/common/byakugan.png' },
    { id: 'eyes2', name: 'Глаза 2', imageUrl: '/img/eyes/common/satore_gojo.png' },
  ],
  mouth: [
    { id: 'mouth1', name: 'Рот 1', imageUrl: '/img/mouth/common/neutral.png' },
    { id: 'mouth2', name: 'Рот 2', imageUrl: '/img/mouth/common/sad.png' },
    { id: 'mouth3', name: 'Рот 3', imageUrl: '/img/mouth/common/smirk.png' },
  ],
  // accessories: [
  //   { id: 'acc1', name: 'Аксессуар 1', imageUrl: '/api/placeholder/60/60/FF69B4' },
  //   { id: 'acc2', name: 'Аксессуар 2', imageUrl: '/api/placeholder/60/60/32CD32' },
  //   { id: 'acc3', name: 'Аксессуар 3', imageUrl: '/api/placeholder/60/60/FFD700' },
  //   { id: 'acc4', name: 'Аксессуар 4', imageUrl: '/api/placeholder/60/60/FF6347' },
  // ],
};

export default function CharacterGenerator() {
  const [selectedParts, setSelectedParts] = useState<CharacterParts>({
    accessory: AVAILABLE_PARTS.accessory[0],
    background: AVAILABLE_PARTS.background[0],
    beard: AVAILABLE_PARTS.beard[0],
    cap: AVAILABLE_PARTS.cap[0],
    cloth: AVAILABLE_PARTS.cloth[0],
    eyes: AVAILABLE_PARTS.eyes[0],
    mouth: AVAILABLE_PARTS.mouth[0],
    // accessories: [AVAILABLE_PARTS.accessories[0]],
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePartChange = (partType: keyof Omit<CharacterParts, 'accessories'>, part: CharacterPart) => {
    setSelectedParts(prev => ({
      ...prev,
      [partType]: part,
    }));
  };

  const handleAccessoryToggle = (accessory: CharacterPart) => {
    setSelectedParts(prev => ({
      ...prev,
      // accessories: prev.accessories.some(acc => acc.id === accessory.id)
      //   ? prev.accessories.filter(acc => acc.id !== accessory.id)
      //   : [...prev.accessories, accessory],
    }));
  };

  const generateCharacter = async () => {
    setIsGenerating(true);
    
    try {
      // Создаем canvas для объединения изображений
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Устанавливаем размер canvas
      canvas.width = 1440;
      canvas.height = 1440;

      // Очищаем canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Загружаем и рисуем части персонажа
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Рисуем части персонажа в правильном порядке
      const parts = [
        { part: selectedParts.background, x: 0, y: 0 },
        { part: selectedParts.accessory, x: 0, y: 0 },
        { part: selectedParts.cloth, x: 0, y: 0 },
        { part: selectedParts.eyes, x: 0, y: 0 },
        { part: selectedParts.cap, x: 0, y: 0 },
        { part: selectedParts.beard, x: 0, y: 0 },
        { part: selectedParts.mouth, x: 0, y: 0 },
      ];

      for (const { part, x, y } of parts) {
        try {
          const img = await loadImage(part.imageUrl);
          ctx.drawImage(img, x, y);
        } catch (error) {
          console.error(`Ошибка загрузки изображения для ${part.name}:`, error);
        }
      }

      // Рисуем аксессуары
      // for (let i = 0; i < selectedParts.accessories.length; i++) {
      //   try {
      //     const accessory = selectedParts.accessories[i];
      //     const img = await loadImage(accessory.imageUrl);
      //     ctx.drawImage(img, 1440, 1440);
      //   } catch (error) {
      //     console.error('Ошибка загрузки аксессуара:', error);
      //   }
      // }

      // Конвертируем canvas в data URL
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Левая панель - выбор частей */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Выберите части персонажа</h2>

          <div className="flex gap-1 text-gray-800">
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Background</button>
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Accessory</button>
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Cloth</button>
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Eyes</button>
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Cap</button>
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Beard</button>
            <button type="button" className="rounded-lg border-2 px-2 cursor-pointer">Mouth</button>
          </div>
          
          <PartSelector
            title="Background"
            parts={AVAILABLE_PARTS.background}
            selectedPart={selectedParts.background}
            onPartSelect={(part) => handlePartChange('background', part)}
          />

          <PartSelector
            title="Accessory"
            parts={AVAILABLE_PARTS.accessory}
            selectedPart={selectedParts.accessory}
            onPartSelect={(part) => handlePartChange('accessory', part)}
          />

          <PartSelector
            title="Cloth"
            parts={AVAILABLE_PARTS.cloth}
            selectedPart={selectedParts.cloth}
            onPartSelect={(part) => handlePartChange('cloth', part)}
          />

          <PartSelector
            title="Eyes"
            parts={AVAILABLE_PARTS.eyes}
            selectedPart={selectedParts.eyes}
            onPartSelect={(part) => handlePartChange('eyes', part)}
          />

          <PartSelector
            title="Cap"
            parts={AVAILABLE_PARTS.cap}
            selectedPart={selectedParts.cap}
            onPartSelect={(part) => handlePartChange('cap', part)}
          />

          <PartSelector
            title="Beard"
            parts={AVAILABLE_PARTS.beard}
            selectedPart={selectedParts.beard}
            onPartSelect={(part) => handlePartChange('beard', part)}
          />

          <PartSelector
            title="Mouth"
            parts={AVAILABLE_PARTS.mouth}
            selectedPart={selectedParts.mouth}
            onPartSelect={(part) => handlePartChange('mouth', part)}
          />
          
          {/* <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Аксессуары</h3>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_PARTS.accessories.map((accessory) => (
                <div
                  key={accessory.id}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    selectedParts.accessories.some(acc => acc.id === accessory.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAccessoryToggle(accessory)}
                >
                  <img
                    src={accessory.imageUrl}
                    alt={accessory.name}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                  <div className="absolute top-1 right-1">
                    {selectedParts.accessories.some(acc => acc.id === accessory.id) && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-center p-2 text-gray-600">{accessory.name}</p>
                </div>
              ))}
            </div>
          </div> */}
          
          <button
            onClick={generateCharacter}
            disabled={isGenerating}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Generating...' : '🎨 Generate'}
          </button>
        </div>
      </div>

      {/* Правая панель - предпросмотр и результат */}
      <div className="space-y-6">
        <CharacterPreview selectedParts={selectedParts} />
        
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