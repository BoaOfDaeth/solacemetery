import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import GameLog from '@/models/GameLog';
import Pagination from '@/components/Pagination';
import ModernTable from '@/components/ModernTable';
import type { Metadata } from 'next';

const LIMIT = 50;

async function getLogs(page: number) {
  try {
    await connectDB();
    const offset = (page - 1) * LIMIT;
    const total = await GameLog.countDocuments();
    const logs = await GameLog.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(LIMIT)
      .lean();

    return {
      logs: logs.map((l) => ({
        id: String(l._id),
        author: l.author,
        title: (l as any).title ?? '(untitled)',
        createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : String(l.createdAt),
      })),
      total,
      totalPages: Math.ceil(total / LIMIT),
    };
  } catch (error) {
    console.error('Error fetching logs:', error);
    return { logs: [], total: 0, totalPages: 0 };
  }
}

export const metadata: Metadata = {
  title: 'Logs',
  description: 'Uploaded game session logs for Solace MUD.',
  alternates: { canonical: '/logs' },
};

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1'));
  const { logs, totalPages } = await getLogs(page);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <p className="text-sm text-muted-foreground italic mb-2">
          To publish a log, please contact the Discord administrators.
        </p>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
            title="Logs"
            showHeader={false}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'author', label: 'Author' },
              { key: 'createdAt', label: 'Date', hideOnMobile: true },
            ]}
            data={logs}
            renderCell={(key, value, row) => {
              if (key === 'title') {
                return (
                  <Link
                    href={`/logs/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {value}
                  </Link>
                );
              }
              if (key === 'author') {
                return (
                  <span className="text-foreground">{value}</span>
                );
              }
              if (key === 'createdAt') {
                return (
                  <span className="text-muted-foreground text-sm">
                    {new Date(value)
                      .toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        year: 'numeric',
                        hour12: false,
                      })
                      .replace(/,/g, '')}
                  </span>
                );
              }
              return value;
            }}
            className="border-0 shadow-none"
          />
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} basePath="/logs" />
        )}
      </div>
    </div>
  );
}
