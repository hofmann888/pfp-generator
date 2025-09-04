'use server'

import { NextResponse } from 'next/server';
import { TMP_IMG_DIR } from '@/lib/const';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  const filePath = path.join(TMP_IMG_DIR, fileName);

  try {
    const imageBuffer = await fs.promises.readFile(filePath);

    return new Response(imageBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length as any as string,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}