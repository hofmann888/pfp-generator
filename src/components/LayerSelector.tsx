'use client';

import { CharacterLayer } from '@/lib/definitions';
import NavigationSelector from './NavigationSelector';

interface LayerSelectorProps {
  layers: CharacterLayer[];
  selectedLayer: number;
  onLayerSelect: (layer: number) => void;
}

export default function LayerSelector({ 
  layers, 
  selectedLayer, 
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
      getItemLabel={(layer) => `Layer ${layer.layer}`}
      title="Choose Layer"
    />
  );
}
