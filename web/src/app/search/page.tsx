import Link from 'next/link';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

interface SearchResult {
  character_name: string;
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
      SELECT DISTINCT killer as character_name, 'pvp_killer' as source
      FROM PVP 
      WHERE killer LIKE ? AND killer != victim
    `, [queryParam]);

    // Search for characters in PVP table (as victims)
    const pvpVictims = await query(`
      SELECT DISTINCT victim as character_name, 'pvp_victim' as source
      FROM PVP 
      WHERE victim LIKE ?
    `, [queryParam]);

    // Search for characters in MVP table (as victims)
    const mvpVictims = await query(`
      SELECT DISTINCT victim as character_name, 'mvp_victim' as source
      FROM MVP 
      WHERE victim LIKE ?
    `, [queryParam]);

    // Combine all results and remove duplicates
    const allResults = [
      ...(pvpKillers as any[]),
      ...(pvpVictims as any[]),
      ...(mvpVictims as any[])
    ];

    // Remove duplicates based on character_name
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex(r => r.character_name === result.character_name)
    );

    // Group sources for each character
    const groupedResults = uniqueResults.reduce((acc, result) => {
      const existing = acc.find((r: SearchResult) => r.character_name === result.character_name);
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

function getSourceLabel(source: string) {
  const sources = source.split(',');
  const labels = sources.map(s => {
    switch (s) {
      case 'mvp_victim':
        return 'MVP Victim';
      case 'pvp_killer':
        return 'PVP Killer';
      case 'pvp_victim':
        return 'PVP Victim';
      default:
        return s;
    }
  });
  return labels.join(', ');
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = searchParams.q;
  
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
      <div className="bg-white shadow">
        <div className="max-w-7xl py-2 ml-7">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-600">
                Found {searchData.total} character
                {searchData.total !== 1 ? 's' : ''} for &quot;
                {decodedQuery}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto pb-2">
        {searchData.results.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Character Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appears As
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {searchData.results.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={`/character/${encodeURIComponent(result.character_name)}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {result.character_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSourceLabel(result.source)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No characters found
            </h3>
            <p className="text-gray-600 mb-4">
              No characters found matching &quot;{decodedQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
