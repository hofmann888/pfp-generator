'use client';

import { CharacterName, CharacterLayer } from '@/lib/definitions';
import NavigationSelector from './NavigationSelector';
import { charachterLayers } from '@/lib/const';

export function getCharacterLayerByIdx(chararacter: CharacterName, idx: number) {
  return charachterLayers[chararacter as CharacterName][idx as any - 1]
}

interface LayerSelectorProps {
  layers: CharacterLayer[];
  selectedLayer: number;
  selectedCharacter: CharacterName;
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
      getItemLabel={(layer) => getCharacterLayerByIdx(selectedCharacter!, layer.layer)}
    />
  );
}
