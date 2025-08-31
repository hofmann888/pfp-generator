'use server'

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    if (!body?.dataUrl) throw Error('Wrong request params.');

    const base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `image-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public', 'tmp', filename);

    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, uri: `tmp/${filename}` });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}