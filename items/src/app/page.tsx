import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import SortChips from '@/components/SortChips';
import ItemsDisplay from '@/components/ItemsDisplay';
import Leaderboard from '@/components/Leaderboard';
import { isAdminFromCookies } from '@/lib/auth';
import { getServerUser } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    filter?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';

  return {
    title: query ? `Items: ${query} - Solabase` : 'Items - Solabase',
    description: `Browse all items${query ? ` matching "${query}"` : ''} in Solabase items database`,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = params.q || '';
  const filter = params.filter || '';
  const sort = params.sort || '';
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const userIsAdmin = await isAdminFromCookies(sessionToken);
  const user = await getServerUser();

  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-lg shadow p-3 mb-4 flex items-center gap-4 flex-wrap">
          {user ? (
            <Link
              href="/post"
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0"
            >
              Add Item
            </Link>
          ) : (
            <a
              href="/api/auth/discord"
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0"
            >
              Add Item
            </a>
          )}
          <div className="flex-1 min-w-0">
            <Leaderboard />
          </div>
        </div>

        {/* Search and Filter Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="mb-4">
            <SearchBar
              currentQuery={query}
              currentFilter={filter}
              currentSort={sort}
            />
          </div>
          <div>
            <FilterChips
              currentFilter={filter}
              currentQuery={query}
              userIsAdmin={userIsAdmin}
            />
          </div>
        </div>

        {/* Sort Chips */}
        <SortChips
          currentSort={sort}
          currentQuery={query}
          currentFilter={filter}
        />

        {/* Items Display - Client Component with SWR */}
        <ItemsDisplay userIsAdmin={userIsAdmin} />
      </div>
    </div>
  );
}
