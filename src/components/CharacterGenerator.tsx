'use client';

import { CharacterAssets, CharacterPart } from '@/lib/definitions';
import { downloadFile } from '@telegram-apps/sdk-react';
import { useState, useRef, useEffect } from 'react';
import CharacterPreview from './CharacterPreview';
import CharacterSelector from './CharacterSelector';
import LayerSelector from './LayerSelector';
import PartSelector from './PartSelector';

export default function CharacterGenerator() {
  const [assets, setAssets] = useState<CharacterAssets | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
  const [selectedParts, setSelectedParts] = useState<CharacterPart[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper function to get random part from array
  function getRandomPart(parts: CharacterPart[]): CharacterPart | null {
    if (parts.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * parts.length);
    return parts[randomIndex];
  }

  // Helper function to check if layer has only one part
  function hasOnlyOnePart(layer: number): boolean {
    if (!currentCharacter) return false;
    const layerData = currentCharacter.layers.find(l => l.layer === layer);
    return layerData ? layerData.parts.length === 1 : false;
  }

  // Fetch assets on mount
  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch('/api/assets', { cache: 'no-store' });
        const data: CharacterAssets = await res.json();
        setAssets(data);
        
        // Set default character and first layer
        if (data.characters.length > 0) {
          const firstCharacter = data.characters[0];
          setSelectedCharacter(firstCharacter.name);
          setSelectedLayer(1);
        }
      } catch (e) {
        console.error('Failed to load assets', e);
      }
    };

    fetchAssets();
  }, []);

  // Update selected parts when character changes (initialize all layers)
  useEffect(() => {
    if (!assets || !selectedCharacter) return;
    
    const character = assets.characters.find(c => c.name === selectedCharacter);
    if (!character) return;
    
    // Initialize with random part from ALL layers of the character
    // For layers with only one part, automatically select that part
    const newSelectedParts: CharacterPart[] = [];
    for (const layerData of character.layers) {
      if (layerData.parts.length === 1) {
        // If layer has only one part, automatically select it
        newSelectedParts.push(layerData.parts[0]);
      } else if (layerData.parts.length > 1) {
        // If layer has multiple parts, select random one
        const randomPart = getRandomPart(layerData.parts);
        if (randomPart) {
          newSelectedParts.push(randomPart);
        }
      }
    }
    
    setSelectedParts(newSelectedParts);
  }, [assets, selectedCharacter]);

  function handleCharacterSelect(characterName: string) {
    setSelectedCharacter(characterName);
    setSelectedLayer(1);
  }

  function handleLayerSelect(layer: number) {
    setSelectedLayer(layer);
    
    // If the selected layer has only one part, ensure it's selected
    if (currentCharacter) {
      const layerData = currentCharacter.layers.find(l => l.layer === layer);
      if (layerData && layerData.parts.length === 1) {
        const singlePart = layerData.parts[0];
        setSelectedParts(prev => {
          const layerNum = parseInt(singlePart.id.split('-')[1]);
          return prev.map(p => {
            const pLayer = parseInt(p.id.split('-')[1]);
            return pLayer === layerNum ? singlePart : p;
          });
        });
      }
    }
  }

  function handlePartSelect(part: CharacterPart) {
    setSelectedParts(prev => {
      const layer = parseInt(part.id.split('-')[1]);
      return prev.map(p => {
        const pLayer = parseInt(p.id.split('-')[1]);
        return pLayer === layer ? part : p;
      });
    });
  }

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

      // Draw each part in order (by layer)
      const sortedParts = [...selectedParts].sort((a, b) => {
        const layerA = parseInt(a.id.split('-')[1]);
        const layerB = parseInt(b.id.split('-')[1]);
        return layerA - layerB;
      });
      
      for (const part of sortedParts) {
        try {
          if (!part || !part.imageUrl) continue;
          const img = await loadImage(part.imageUrl);
          ctx.drawImage(img, 0, 0);
        } catch (error) {
          console.error(`Image download error for ${part?.name}:`, error);
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      await downloadCharacter(dataUrl);
    } catch (error) {
      console.error('Character generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  async function downloadCharacter(dataUrl: string) {
    if (!dataUrl) return;

    if (downloadFile.isAvailable()) { // Tg download
      // Saving temporary file on server for tg
      const saveResponse = await fetch('/api/img/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: dataUrl }),
      });
      const saveResult = await saveResponse.json();
      if (!saveResult.success || !saveResult.uri.length) {
        throw Error('Error saving tmp file');
      }

      // Tg download
      await downloadFile(`${location.origin}/${saveResult.uri}`, `${selectedCharacter}.png`);

      // Deleting temporary file from server
      const deleteResponse = await fetch('/api/img/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: saveResult.uri }),
      });
      const deleteResult = await deleteResponse.json();
      if (!deleteResult.success) {
        throw Error(`Error deleting tmp file ${saveResult.uri}`);
      }
    } else { // Web download
      const link = document.createElement('a');
      link.download = `${selectedCharacter}.png`;
      link.href = dataUrl;
      link.click();
    }
  }

  if (!assets || assets.characters.length === 0) {
    return <div className="min-h-[inherit] flex items-center justify-center">Loading...</div>;
  }

  const currentCharacter = assets.characters.find(c => c.name === selectedCharacter);
  const currentLayer = currentCharacter?.layers.find(l => l.layer === selectedLayer);
  const currentPart = selectedParts.find(p => p.id.includes(`-${selectedLayer}-`));

  return (
    <div className="flex gap-8 max-md:gap-0 max-md:flex-col min-h-[inherit]">
      <div className="w-1/2 max-md:w-full">
        <CharacterPreview selectedParts={selectedParts} />

        <button
          onClick={generateCharacter}
          disabled={isGenerating}
          className="min-md:hidden w-full mt-4 py-3 px-6 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] uppercase text-white text-shadow-contur cursor-pointer"
        >
          {isGenerating ? 'Generating...' : 'Download your pfp'}
        </button>
      </div>

      <div className="w-1/2 max-md:w-full flex flex-col">
        <CharacterSelector 
          characters={assets.characters}
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleCharacterSelect}
        />
        
        {currentCharacter && (
          <LayerSelector 
            layers={currentCharacter.layers.filter(layer => layer.parts.length > 1)}
            selectedLayer={selectedLayer}
            selectedCharacter={selectedCharacter}
            onLayerSelect={handleLayerSelect}
          />
        )}
        
        {currentLayer && !hasOnlyOnePart(selectedLayer) && (
          <PartSelector 
            parts={currentLayer.parts}
            selectedPart={currentPart || null}
            onPartSelect={handlePartSelect}
          />
        )}

        <button
          onClick={generateCharacter}
          disabled={isGenerating}
          className="max-md:hidden max-lg:min-h-[52px] min-h-[76px] w-full mt-4 py-3 px-6 rounded-2xl bg-[#F45CFF] border-2 border-black shadow-[1px_3px_0px_3px_#000] uppercase text-white max-lg:text-lg text-3xl text-shadow-contur cursor-pointer"
        >
          {isGenerating ? 'Generating...' : 'Download your pfp'}
        </button>
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