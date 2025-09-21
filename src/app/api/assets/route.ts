import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { Character, CharacterName, CharacterPart, CharacterLayer } from '@/lib/definitions';

export async function GET() {
  try {
    const publicImgDir = path.join(process.cwd(), 'public', 'img', 'pfp', 'layers');
    const characterDirs = await fs.readdir(publicImgDir, { withFileTypes: true });
    const characters: Character[] = [];

    for (const characterDir of characterDirs) {
      if (!characterDir.isDirectory()) continue;

      const characterName = characterDir.name as CharacterName;
      const characterPath = path.join(publicImgDir, characterName);

      const layerDirs = await fs.readdir(characterPath, { withFileTypes: true });
      const layers: CharacterLayer[] = [];

      for (const layerDir of layerDirs) {
        if (!layerDir.isDirectory()) continue;
        
        const layerIdx = parseInt(layerDir.name);
        if (isNaN(layerIdx)) continue;
        
        const layerPath = path.join(characterPath, layerDir.name);
        const files = await fs.readdir(layerPath, { withFileTypes: true });
        const parts: CharacterPart[] = [];

        for (const file of files) {
          if (file.isFile()) {
            const ext = path.extname(file.name).toLowerCase();
            // Basic image extensions filter
            if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) continue;

            const base = path.parse(file.name).name;
            const imageUrl = `/img/pfp/layers/${characterName}/${layerIdx}/${file.name}`;
            parts.push({
              id: `${characterName}-${layerIdx}-${base}`,
              name: base,
              imageUrl,
            });
          }
        }

        // Only include layer if it has parts
        if (parts.length > 0) {
          layers.push({
            layer: layerIdx,
            parts: parts.sort((a, b) => a.name.localeCompare(b.name))
          });
        }
      }

      // Only include character if it has at least one layer with parts
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