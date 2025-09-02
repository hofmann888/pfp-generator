import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface AssetItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface CharacterLayer {
  layer: number;
  parts: AssetItem[];
}

interface Character {
  name: string;
  layers: CharacterLayer[];
}

export async function GET() {
  try {
    const publicImgDir = path.join(process.cwd(), 'public', 'img', 'pfp');
    const characterDirs = await fs.readdir(publicImgDir, { withFileTypes: true });
    const characters: Character[] = [];

    for (const characterDir of characterDirs) {
      if (!characterDir.isDirectory()) continue;

      const characterName = characterDir.name; // e.g. ari, elric, freya, kenzo, roger
      const characterPath = path.join(publicImgDir, characterName);

      const levelDirs = await fs.readdir(characterPath, { withFileTypes: true });
      const layers: CharacterLayer[] = [];

      for (const levelDir of levelDirs) {
        if (!levelDir.isDirectory()) continue;
        
        const levelNumber = parseInt(levelDir.name);
        if (isNaN(levelNumber)) continue;
        
        const levelPath = path.join(characterPath, levelDir.name);
        const files = await fs.readdir(levelPath, { withFileTypes: true });
        const parts: AssetItem[] = [];

        for (const file of files) {
          if (file.isFile()) {
            const ext = path.extname(file.name).toLowerCase();
            // Basic image extensions filter
            if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) continue;

            const base = path.parse(file.name).name;
            const imageUrl = `/img/pfp/${characterName}/${levelNumber}/${file.name}`;
            parts.push({
              id: `${characterName}-${levelNumber}-${base}`,
              name: base,
              imageUrl,
            });
          }
        }

        // Only include level if it has parts
        if (parts.length > 0) {
          layers.push({
            layer: levelNumber,
            parts: parts.sort((a, b) => a.name.localeCompare(b.name))
          });
        }
      }

      // Only include character if it has at least one level with parts
      if (layers.length > 0) {
        characters.push({
          name: characterName,
          layers: layers.sort((a, b) => a.layer - b.layer)
        });
      }
    }

    // Sort characters alphabetically
    characters.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ characters });
  } catch (error) {
    console.error('Error reading public/img/pfp:', error);
    return NextResponse.json({ error: 'Failed to read assets' }, { status: 500 });
  }
} 