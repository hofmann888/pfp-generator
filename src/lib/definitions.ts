export type CharacterName = "ari" | "elric" | "freya" | "kenzo" | "roger";

export interface Character {
  name: CharacterName;
  layers: CharacterLayer[];
}

export interface CharacterPart {
  id: string;
  name: string;
  imageUrl: string;
}

export interface CharacterLayer {
  layer: number;
  parts: CharacterPart[];
}

export interface CharacterAssets {
  characters: Character[];
}