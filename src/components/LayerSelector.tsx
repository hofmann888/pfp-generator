'use client';

import { CharacterLayer } from '@/lib/definitions';
import NavigationSelector from './NavigationSelector';

type CharacterName = "ari" | "elric" | "freya" | "kenzo" | "roger";

const charachterLayers = {
  ari: ["background", "accessory", "body", "cloth", "head", "eyes", "mouth", "hat"],
  elric: ["background", "body", "cloth", "head", "face", "eyes", "mouth", "hat", "accessory"],
  freya: ["background", "accessory", "body", "cloth", "head", "mouth", "eyes", "hat"],
  kenzo: ["background", "body", "cloth", "head", "face", "eyes", "mouth", "mustache", "beard", "hat"],
  roger: ["background", "accessory", "body", "cloth", "head", "eyes", "beard", "mouth", "hat"]
} as Record<CharacterName, string[]>;

interface LayerSelectorProps {
  layers: CharacterLayer[];
  selectedLayer: number;
  selectedCharacter: string;
  onLayerSelect: (layer: number) => void;
}

export default function LayerSelector({ 
  layers, 
  selectedLayer, 
  selectedCharacter,
  onLayerSelect 
}: LayerSelectorProps) {
  const selectedLayerObj = layers.find(l => l.layer === selectedLayer);

  if (!selectedLayerObj) {
    return null;
  }

  return (
    <NavigationSelector
      items={layers}
      selectedItem={selectedLayerObj}
      onItemSelect={(layer) => onLayerSelect(layer.layer)}
      getItemLabel={(layer) => charachterLayers[selectedCharacter as CharacterName][layer.layer as any - 1]}
    />
  );
}
