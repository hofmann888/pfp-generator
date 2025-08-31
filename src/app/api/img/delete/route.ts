'use server'

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    if (!body?.uri) throw Error('Wrong request params.');

    const filePath = path.join(process.cwd(), 'public', body?.uri);

    await fs.promises.unlink(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}