import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GameLog from '@/models/GameLog';
import { processGameLogData } from '@/lib/processGameLogData';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    let author: string | undefined;
    let title: string | undefined;
    let text: string | undefined;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      author = form.get('author')?.toString();
      title = form.get('title')?.toString();

      const file = form.get('file');
      if (file instanceof File) {
        text = await file.text();
      }
    } else {
      const body = await request.json();
      author = body.author;
      title = body.title;
      text = body.text;
    }

    if (!author || typeof author !== 'string') {
      return NextResponse.json({ success: false, error: 'author is required' }, { status: 400 });
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ success: false, error: 'title is required' }, { status: 400 });
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'text or file is required' },
        { status: 400 }
      );
    }

    const processed = processGameLogData({ text });

    const log = new GameLog({
      author,
      title,
      text,
      html: processed.html,
    });

    const saved = await log.save();

    return NextResponse.json({ success: true, data: { id: saved._id } }, { status: 201 });
  } catch (error) {
    console.error('Error saving game log:', error);
    return NextResponse.json({ success: false, error: 'Failed to save log' }, { status: 500 });
  }
}
