'use client';

import { Character, CharacterName } from '@/lib/definitions';
import NavigationSelector from './NavigationSelector';

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacter: CharacterName;
  onCharacterSelect: (characterName: CharacterName) => void;
}

export default function CharacterSelector({ 
  characters, 
  selectedCharacter, 
  onCharacterSelect 
}: CharacterSelectorProps) {
  const selectedCharacterObj = characters.find(c => c.name === selectedCharacter);
  
  if (!selectedCharacterObj) {
    return null;
  }

  return (
    <NavigationSelector
      items={characters}
      selectedItem={selectedCharacterObj}
      onItemSelect={(character) => onCharacterSelect(character.name)}
      getItemLabel={(character) => character.name}
    />
  );
}