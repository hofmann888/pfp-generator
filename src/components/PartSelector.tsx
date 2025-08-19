'use client';

import { CharacterPart } from './CharacterGenerator';

interface PartSelectorProps {
  title: string;
  parts: CharacterPart[];
  selectedPart: CharacterPart;
  onPartSelect: (part: CharacterPart) => void;
}

// Note: This component is currently unused after dynamic categories refactor.
export default function PartSelector({ title, parts, selectedPart, onPartSelect }: PartSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {parts.map((part) => (
          <div
            key={part.id}
            className={`relative cursor-pointer rounded-lg border-2 transition-all ${
              selectedPart.id === part.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPartSelect(part)}
          >
            <img
              src={part.imageUrl}
              alt={part.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-1 right-1">
              {selectedPart.id === part.id && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-xs text-center p-2 text-gray-600">{part.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 