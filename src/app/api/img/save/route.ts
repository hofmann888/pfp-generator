'use server'

import { NextRequest, NextResponse } from 'next/server';
import { TMP_IMG_DIR } from '@/lib/const';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body  = await request.json();
    if (!body?.dataUrl || !body?.character) throw Error('Wrong request params.');

    const base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${body.character}-${Date.now()}.png`;
    const filePath = path.join(TMP_IMG_DIR, fileName);

    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, fileName: `${fileName}` });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}