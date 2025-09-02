export interface CharacterPart {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CharacterLayer {
  layer: number;
  parts: CharacterPart[];
}

export interface Character {
  name: string;
  layers: CharacterLayer[];
}

export interface CharacterAssets {
  characters: Character[];
}