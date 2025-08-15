import Link from 'next/link';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';

interface SearchResult {
  name: string;
  type: 'character' | 'monster';
  source: string;
}

interface SearchData {
  query: string;
  results: SearchResult[];
  total: number;
}

async function getSearchResults(searchQuery: string): Promise<SearchData | null> {
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

    return {
      query: searchQuery.trim(),
      results: groupedResults,
      total: groupedResults.length,
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return null;
  }
}



export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Await searchParams before accessing its properties
  const { q: searchQuery } = await searchParams;
  
  if (!searchQuery) {
    notFound();
  }

  // Decode the search query to handle spaces properly
  const decodedQuery = decodeURIComponent(searchQuery);
  const searchData = await getSearchResults(decodedQuery);

  if (!searchData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <PageHeader 
        title="Search Results"
        subtitle={`Found ${searchData.total} result${searchData.total !== 1 ? 's' : ''} for "${decodedQuery}"`}
      />

      {/* Search Results */}
      <div className="max-w-7xl mx-auto pb-2">
        {searchData.results.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {searchData.results.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={result.type === 'character' 
                        ? `/character/${encodeURIComponent(result.name)}`
                        : `/mob/${encodeURIComponent(result.name)}`
                      }
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {result.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.type === 'character' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.type === 'character' ? 'Character' : 'Monster'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-4">
              No characters or monsters found matching &quot;{decodedQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
