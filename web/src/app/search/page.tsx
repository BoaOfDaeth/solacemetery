import Link from 'next/link';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Pagination from '@/components/Pagination';
import ModernTable from '@/components/ModernTable';

interface SearchResult {
  name: string;
  type: 'character' | 'monster';
  source: string;
}

interface SearchData {
  query: string;
  results: SearchResult[];
  total: number;
  currentPage: number;
  totalPages: number;
}

async function getSearchResults(searchQuery: string, page: number = 1, limit: number = 50): Promise<SearchData | null> {
  try {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return null;
    }

    const queryParam = `%${searchQuery.trim()}%`;

    // Search for characters in PVP table (as killers)
    const pvpKillers = await query(`
      SELECT DISTINCT killer as name, 'pvp_killer' as source
      FROM PVP 
      WHERE killer LIKE ? AND killer != victim
    `, [queryParam]);

    // Search for characters in PVP table (as victims)
    const pvpVictims = await query(`
      SELECT DISTINCT victim as name, 'pvp_victim' as source
      FROM PVP 
      WHERE victim LIKE ?
    `, [queryParam]);

    // Search for characters in MVP table (as victims)
    const mvpVictims = await query(`
      SELECT DISTINCT victim as name, 'mvp_victim' as source
      FROM MVP 
      WHERE victim LIKE ?
    `, [queryParam]);

    // Search for monsters in MVP table (as killers)
    const mvpKillers = await query(`
      SELECT DISTINCT killer as name, 'mvp_killer' as source
      FROM MVP 
      WHERE killer LIKE ?
    `, [queryParam]);

    // Combine all results and remove duplicates
    const allResults = [
      ...(pvpKillers as any[]).map(r => ({ ...r, type: 'character' as const })),
      ...(pvpVictims as any[]).map(r => ({ ...r, type: 'character' as const })),
      ...(mvpVictims as any[]).map(r => ({ ...r, type: 'character' as const })),
      ...(mvpKillers as any[]).map(r => ({ ...r, type: 'monster' as const }))
    ];

    // Remove duplicates based on name and type
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex(r => r.name === result.name && r.type === result.type)
    );

    // Group sources for each character/monster
    const groupedResults = uniqueResults.reduce((acc, result) => {
      const existing = acc.find((r: SearchResult) => r.name === result.name && r.type === result.type);
      if (existing) {
        existing.source += `,${result.source}`;
      } else {
        acc.push({ ...result });
      }
      return acc;
    }, [] as SearchResult[]);

    // Calculate pagination
    const total = groupedResults.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    
    // Get paginated results
    const paginatedResults = groupedResults.slice(offset, offset + limit);

    return {
      query: searchQuery.trim(),
      results: paginatedResults,
      total,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return null;
  }
}



export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // Await searchParams before accessing its properties
  const { q: searchQuery, page: pageParam } = await searchParams;
  
  if (!searchQuery) {
    notFound();
  }

  // Decode the search query to handle spaces properly
  const decodedQuery = decodeURIComponent(searchQuery);
  const page = parseInt(pageParam || '1');
  const limit = 50;
  
  const searchData = await getSearchResults(decodedQuery, page, limit);

  if (!searchData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
        title={`${searchData.total} result${searchData.total !== 1 ? 's' : ''} for "${decodedQuery}"`}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' }
        ]}
        data={searchData.results}
        renderCell={(key, value, row) => {
          if (key === 'name') {
            return (
              <Link
                href={row.type === 'character' 
                  ? `/character/${encodeURIComponent(row.name)}`
                  : `/mob/${encodeURIComponent(row.name)}`
                }
                className="text-primary hover:text-primary/80 hover:underline font-medium"
              >
                {row.name}
              </Link>
            );
          }
          if (key === 'type') {
            return (
              <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                row.type === 'character' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {row.type === 'character' ? 'Character' : 'Monster'}
              </span>
            );
          }
          return value;
        }}
            className="border-0 shadow-none"
          />
        </div>
        
        {searchData.totalPages > 1 && (
          <Pagination 
            currentPage={searchData.currentPage} 
            totalPages={searchData.totalPages} 
            basePath={`/search?q=${encodeURIComponent(decodedQuery)}`}
          />
        )}
      </div>
    </div>
  );
}
