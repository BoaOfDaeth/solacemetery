import { Metadata } from 'next';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import ExpandableItemCard from '@/components/ExpandableItemCard';
import { ItemData } from '@/types/item';
import {
  getShadowColor,
  getBorderColor,
  getBackgroundLevelColor,
  addVisibilityFilter,
} from '@/lib/helpers';
import { isAdminFromCookies } from '@/lib/auth';

interface ParsedItemLean {
  _id: string;
  name: string;
  hru: string;
  level: number;
  type?: string;
  slot?: string;
  raw: string;
  damageType?: string;
  averageDamage?: number;
  acAverage?: number;
  acBonus?: number;
  damrollBonus?: number;
  whenWorn?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    mana?: number;
    health?: number;
    hitRoll?: number;
  };
  roomHistory: string[];
  createdAt: Date;
  updatedAt: Date;
  hidden: boolean;
  visibleAfter?: Date;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Compare Items - Solabase',
  description: 'Compare items from Solace MUD database',
};

interface ComparePageProps {
  searchParams: Promise<{
    items?: string;
  }>;
}

async function getItemsByIds(
  itemIds: string[],
  userIsAdmin: boolean
): Promise<{
  items: ItemData[];
  parsedItems: ParsedItemLean[];
}> {
  try {
    await connectDB();

    const validIds = itemIds.filter(id => {
      try {
        return id && id.length === 24;
      } catch {
        return false;
      }
    });

    if (validIds.length === 0) {
      return { items: [], parsedItems: [] };
    }

    const query: Record<string, unknown> = {
      _id: { $in: validIds },
    };

    if (!userIsAdmin) {
      query.hidden = { $ne: true };
    }

    // Apply visibility filter (visibleAfter for API posts)
    const filteredQuery = addVisibilityFilter(query, userIsAdmin);

    const parsedItems =
      await ParsedItem.find(filteredQuery).lean<ParsedItemLean[]>();

    const items = parsedItems.map(item => ({
      _id: String(item._id),
      raw: String(item.raw),
      createdAt: String(item.createdAt),
      updatedAt: String(item.updatedAt),
      parsedId: item.hru,
    }));

    return { items, parsedItems };
  } catch (error) {
    console.error('Error fetching items by IDs:', error);
    return { items: [], parsedItems: [] };
  }
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const userIsAdmin = await isAdminFromCookies(sessionToken);

  // Parse items from URL parameters for SSR
  const itemsParam = params.items || '';
  const itemIds = itemsParam.split(',').filter(id => id.trim());

  // Fetch items server-side
  const { items, parsedItems } = await getItemsByIds(itemIds, userIsAdmin);

  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-6xl mx-auto w-full">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <p className="text-lg">No items to compare</p>
              <p className="text-sm mt-2">Select items to compare them here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => {
              const parsedItem = parsedItems[index];
              if (!parsedItem) return null;

              // Check if item is pending (visibleAfter is in the future)
              // visibleAfter is a Date object from the database
              // Admins should see pending items with dotted borders too
              const isPending = Boolean(
                parsedItem.visibleAfter &&
                  new Date(parsedItem.visibleAfter).getTime() > Date.now()
              );

              return (
                <ExpandableItemCard
                  key={item._id}
                  title={parsedItem.name}
                  subtitle={`Level ${parsedItem.level}${
                    parsedItem.type ? ` • ${parsedItem.type}` : ''
                  }${parsedItem.slot ? ` • ${parsedItem.slot}` : ''}`}
                  rawItem={item}
                  damageType={parsedItem.damageType}
                  averageDamage={parsedItem.averageDamage}
                  acAverage={parsedItem.acAverage}
                  acBonus={parsedItem.acBonus}
                  damrollBonus={parsedItem.damrollBonus}
                  whenWorn={parsedItem.whenWorn}
                  defaultExpanded={true}
                  showExpandButton={false}
                  userIsAdmin={userIsAdmin}
                  itemHidden={Boolean(parsedItem.hidden)}
                  isPending={isPending}
                  cardStyle={{
                    boxShadow: getShadowColor(parsedItem.level),
                    borderColor: getBorderColor(parsedItem.level),
                    backgroundColor: getBackgroundLevelColor(parsedItem.level),
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
