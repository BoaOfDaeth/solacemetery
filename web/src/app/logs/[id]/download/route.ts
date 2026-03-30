import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GameLog from '@/models/GameLog';

function filenameSafe(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await connectDB();
  const log = await GameLog.findById(id, { title: 1, author: 1, text: 1, createdAt: 1 }).lean();

  if (!log) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const title = typeof (log as any).title === 'string' ? (log as any).title : 'log';
  const createdAt = (log as any).createdAt instanceof Date ? (log as any).createdAt : new Date();
  const stamp = createdAt.toISOString().slice(0, 10);

  const fileBase = filenameSafe(`${stamp}-${title}`) || `log-${stamp}`;
  const filename = `${fileBase}.txt`;

  return new NextResponse((log as any).text ?? '', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
      'cache-control': 'no-store',
    },
  });
}

