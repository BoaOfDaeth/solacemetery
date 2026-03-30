import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import GameLog from '@/models/GameLog';
import type { Metadata } from 'next';
import { processGameLogData } from '@/lib/processGameLogData';

interface LogPageProps {
  params: Promise<{ id: string }>;
}

async function getLog(id: string) {
  try {
    await connectDB();
    const log = await GameLog.findById(id).lean();
    if (!log) return null;
    return {
      id: String(log._id),
      author: log.author,
      title: (log as any).title ?? 'Log',
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : String(log.createdAt),
      text: log.text,
      html: (log as any).html as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: LogPageProps): Promise<Metadata> {
  const { id } = await params;
  const log = await getLog(id);
  if (!log) return { title: 'Log Not Found' };
  return {
    title: log.title,
    description: log.text.substring(0, 160),
    alternates: { canonical: `/logs/${id}` },
  };
}

export default async function LogPage({ params }: LogPageProps) {
  const { id } = await params;
  const log = await getLog(id);

  if (!log) notFound();

  const html = log.html ?? processGameLogData({ text: log.text }).html;

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 overflow-x-hidden">
        <pre
          className="log-body-mono whitespace-pre-wrap break-words max-w-full text-[10px] leading-[1.1] sm:text-xs sm:leading-[1.15] md:text-sm md:leading-[1.2] text-foreground"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
