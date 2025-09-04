'use server'

import { NextRequest, NextResponse } from 'next/server';
import { TMP_IMG_DIR } from '@/lib/const';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    if (!body?.fileName) throw Error('Wrong request params.');

    const filePath = path.join(TMP_IMG_DIR, body?.fileName);

    await fs.promises.unlink(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}