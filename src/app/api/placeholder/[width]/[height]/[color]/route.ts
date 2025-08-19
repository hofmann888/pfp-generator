import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string; color: string } }
) {
  try {
    const width = parseInt(params.width);
    const height = parseInt(params.height);
    const color = params.color;

    // Создаем SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" 
              fill="white" text-anchor="middle" dy=".3em">
          ${width}x${height}
        </text>
      </svg>
    `;

    // Конвертируем SVG в base64
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;

    // Возвращаем SVG как изображение
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return new NextResponse('Error generating placeholder', { status: 500 });
  }
} 