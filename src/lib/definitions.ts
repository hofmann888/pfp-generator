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

export interface CategoryAssets {
  category: string;
  rarities: Record<string, CharacterPart[]>;
}