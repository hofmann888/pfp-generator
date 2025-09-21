import path from 'path';
import { CharacterName } from './definitions';

export const TMP_IMG_DIR = path.join(process.cwd(), 'public', 'tmp');

export const charachterLayers = {
  ari: ["background", "accessory", "body", "cloth", "head", "eyes", "mouth", "hat"],
  elric: ["background", "body", "cloth", "head", "face", "eyes", "mouth", "hat", "accessory"],
  freya: ["background", "accessory", "body", "cloth", "head", "mouth", "eyes", "hat"],
  kenzo: ["background", "body", "cloth", "head", "face", "eyes", "mouth", "mustache", "beard", "hat"],
  roger: ["background", "accessory", "body", "cloth", "head", "eyes", "beard", "mouth", "hat"]
} as Record<CharacterName, string[]>;