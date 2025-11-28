import { Metadata } from 'next';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import Item from '@/models/Item';
import ExpandableItemCard from '@/components/ExpandableItemCard';
import RoomHistory from '@/components/RoomHistory';
import { notFound } from 'next/navigation';
import {
  getShadowColor,
  getBorderColor,
  getBackgroundLevelColor,
} from '@/lib/helpers';
import { isAdminFromCookies } from '@/lib/auth';
import { getVisibilityLog } from '@/services/visibilityService';

interface ParsedItemLean {
  _id: string;
  name: string;
  hru: string;
  level: number;
  type?: string;
  slot?: string;
  raw: string;
  roomHistory: string[];
  createdAt: Date;
  updatedAt: Date;
  hidden: boolean;
  visibleAfter?: Date;
}

export const dynamic = 'force-dynamic';

interface ItemPageProps {
  params: Promise<{
    hru: string;
  }>;
}

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const hru = decodeURIComponent(resolvedParams.hru);

  try {
    await connectDB();
    const item = await ParsedItem.findOne({ hru }).lean();

    if (!item) {
      return {
        title: 'Item Not Found - Solabase',
        description:
          'The requested item could not be found in the Solabase database.',
      };
    }

    // Create title with name, level, and type
    const title = `${item.name} (Level ${item.level}${
      item.type ? ` • ${item.type}` : ''
    })`;

    // Use raw data as description, truncated to reasonable length
    const rawDescription =
      item.raw.length > 295 ? item.raw.substring(0, 295) + '...' : item.raw;

    return {
      title: `${title} - Solabase`,
      description: rawDescription,
      openGraph: {
        title: title,
        description: rawDescription,
        type: 'website',
        siteName: 'Solabase',
        url: `https://solabase.deliriumtech.online/item/${encodeURIComponent(hru)}`,
      },
      twitter: {
        card: 'summary',
        title: title,
        description: rawDescription,
        site: '@solabase',
      },
      alternates: {
        canonical: `https://solabase.deliriumtech.online/item/${encodeURIComponent(hru)}`,
      },
    };
  } catch {
    return {
      title: 'Item - Solabase',
      description: 'View item details in the Solabase database.',
    };
  }
}

async function getItem(hru: string) {
  try {
    await connectDB();
    const parsedItem = await ParsedItem.findOne({ hru }).lean<ParsedItemLean>();
    if (!parsedItem) return null;

    // Get posting information from Items that match this parsedItem
    const postingItems = await Item.find({
      parsedId: hru,
      by: { $exists: true, $ne: null },
    })
      .select('by createdAt')
      .sort({ createdAt: 1 })
      .lean<Array<{ by: string; createdAt: Date }>>();

    // Use raw item data from the parsed item
    const rawItem = {
      _id: String(parsedItem._id),
      raw: String(parsedItem.raw),
      createdAt: String(parsedItem.createdAt),
      updatedAt: String(parsedItem.updatedAt),
      parsedId: parsedItem.hru,
    };

    // Serialize parsedItem to plain object
    const serializedParsedItem = {
      _id: String(parsedItem._id),
      name: parsedItem.name,
      hru: parsedItem.hru,
      level: parsedItem.level,
      type: parsedItem.type,
      slot: parsedItem.slot,
      raw: String(parsedItem.raw),
      roomHistory: parsedItem.roomHistory,
      createdAt: String(parsedItem.createdAt),
      updatedAt: String(parsedItem.updatedAt),
      hidden: Boolean(parsedItem.hidden),
      visibleAfter: parsedItem.visibleAfter
        ? String(parsedItem.visibleAfter)
        : undefined,
    };

    return {
      parsedItem: serializedParsedItem,
      rawItem,
      postingInfo: postingItems.map(item => ({
        username: String(item.by),
        postedAt: item.createdAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const resolvedParams = await params;
  const hru = decodeURIComponent(resolvedParams.hru);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const userIsAdmin = await isAdminFromCookies(sessionToken);
  const item = await getItem(hru);

  if (!item) {
    notFound();
  }

  // Block hidden items for non-admins (but allow pending items via direct link)
  if (!userIsAdmin && item.parsedItem.hidden) {
    notFound();
  }

  // Check if item is pending (visibleAfter is in the future)
  // visibleAfter is a Date object from the database
  // Admins should see pending items with dotted borders too
  const isPending = Boolean(
    item.parsedItem.visibleAfter &&
      new Date(item.parsedItem.visibleAfter).getTime() > Date.now()
  );
  const visibilityLog = userIsAdmin ? await getVisibilityLog(hru) : [];

  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-3xl mx-auto w-full">
        <ExpandableItemCard
          title={item.parsedItem.name}
          subtitle={`Level ${item.parsedItem.level}${
            item.parsedItem.type ? ` • ${item.parsedItem.type}` : ''
          }${item.parsedItem.slot ? ` • ${item.parsedItem.slot}` : ''}`}
          rawItem={item.rawItem}
          defaultExpanded={true}
          showExpandButton={false}
          userIsAdmin={userIsAdmin}
          itemHidden={Boolean(item.parsedItem.hidden)}
          isPending={isPending}
          cardStyle={{
            boxShadow: getShadowColor(item.parsedItem.level),
            borderColor: getBorderColor(item.parsedItem.level),
            backgroundColor: getBackgroundLevelColor(item.parsedItem.level),
          }}
        />

        {userIsAdmin && (
          <div className="mt-4 flex flex-col gap-2">
            {item.postingInfo && item.postingInfo.length > 0 && (
              <div className="bg-white rounded-lg shadow p-3">
                <h2 className="text-sm font-semibold mb-2">Posting history</h2>
                <ul className="space-y-1 text-xs text-gray-600">
                  {item.postingInfo.map((post, index) => (
                    <li key={index} className="flex justify-between gap-4">
                      <span>
                        Posted by{' '}
                        <span className="font-semibold">{post.username}</span>
                      </span>
                      <span className="text-gray-400">
                        {new Date(post.postedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-white rounded-lg shadow p-3">
              <h2 className="text-sm font-semibold mb-2">Visibility history</h2>
              {visibilityLog.length === 0 ? (
                <p className="text-xs text-gray-500">No actions recorded.</p>
              ) : (
                <ul className="space-y-1 text-xs text-gray-600">
                  {visibilityLog.map(entry => (
                    <li
                      key={String(entry._id)}
                      className="flex justify-between gap-4"
                    >
                      <span>
                        {entry.action === 'hide' ? 'Hidden' : 'Restored'} by{' '}
                        <span className="font-semibold">
                          {entry.performedByUsername}
                        </span>
                      </span>
                      <span className="text-gray-400">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Room History - Only visible to admins */}
        {userIsAdmin && (
          <div className="mt-3">
            <RoomHistory roomHistory={item.parsedItem.roomHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
