import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface AssetItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface CategoryPayload {
  category: string;
  rarities: Record<string, AssetItem[]>;
}

export async function GET() {
  try {
    const publicImgDir = path.join(process.cwd(), 'public', 'img', 'pfp');
    const categories = await fs.readdir(publicImgDir, { withFileTypes: true });
    const categoryPayloads: CategoryPayload[] = [];

    for (const categoryDirent of categories) {
      if (!categoryDirent.isDirectory()) continue;

      const category = categoryDirent.name; // e.g. background, accessory, ...
      const categoryPath = path.join(publicImgDir, category);

      const rarityDirents = await fs.readdir(categoryPath, { withFileTypes: true });
      const rarities: Record<string, AssetItem[]> = {};

      for (const rarityDirent of rarityDirents) {
        if (!rarityDirent.isDirectory()) continue;
        const rarity = rarityDirent.name; // e.g. common, rare, epic, legendary
        const rarityPath = path.join(categoryPath, rarity);

        const files = await fs.readdir(rarityPath, { withFileTypes: true });
        const items: AssetItem[] = [];

        for (const file of files) {
          if (file.isFile()) {
            const ext = path.extname(file.name).toLowerCase();
            // Basic image extensions filter
            if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) continue;

            const base = path.parse(file.name).name;
            const imageUrl = `/img/pfp/${category}/${rarity}/${file.name}`;
            items.push({
              id: `${category}-${rarity}-${base}`,
              name: base,
              imageUrl,
            });
          }
        }

        // Only include rarity if it has images
        if (items.length > 0) {
          rarities[rarity] = items;
        }
      }

      // Only include category if it has at least one rarity with items
      if (Object.keys(rarities).length > 0) {
        categoryPayloads.push({ category, rarities });
      }
    }

    // Sort categories alphabetically for consistent tabs
    categoryPayloads.sort((a, b) => a.category.localeCompare(b.category));

    return NextResponse.json({ categories: categoryPayloads });
  } catch (error) {
    console.error('Error reading public/img:', error);
    return NextResponse.json({ error: 'Failed to read assets' }, { status: 500 });
  }
} 