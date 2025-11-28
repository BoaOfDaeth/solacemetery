'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCompareStore } from '@/store/compareStore';
import { ItemData } from '@/types/item';
import AdminVisibilityToggle from '@/components/AdminVisibilityToggle';
// import LastTimeItFound from './LastTimeItFound';

interface ItemCardProps {
  item: ItemData;
  userIsAdmin?: boolean;
  itemHidden?: boolean;
}

export default function ItemCard({
  item,
  userIsAdmin = false,
  itemHidden = false,
}: ItemCardProps) {
  const { toggleItem, isSelected } = useCompareStore();
  const selected = isSelected(item._id);
  const [linkCopied, setLinkCopied] = useState(false);

  return (
    <div>
      <div className="mb-3 flex justify-start gap-3">
        <button
          onClick={() => toggleItem(item._id)}
          className="text-black hover:text-gray-700 underline text-sm select-none cursor-pointer"
        >
          {selected ? 'remove from comparison' : 'add to comparison'}
        </button>
        {item.parsedId && (
          <>
            <Link
              href={`/item/${item.parsedId}`}
              className="text-black hover:text-gray-700 underline text-sm select-none cursor-pointer"
            >
              view details
            </Link>
            <button
              onClick={() => {
                const url = `${window.location.origin}/item/${item.parsedId}`;
                navigator.clipboard.writeText(url);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 600);
              }}
              className="text-black hover:text-gray-700 text-sm select-none cursor-pointer relative overflow-hidden inline-block"
            >
              <span
                className={`inline-block transition-transform duration-300 ease-in-out whitespace-nowrap underline ${
                  linkCopied
                    ? 'transform -translate-y-full'
                    : 'transform translate-y-0'
                }`}
              >
                copy link
              </span>
              <span
                className={`absolute top-0 left-0 inline-block transition-transform duration-300 ease-in-out whitespace-nowrap underline ${
                  linkCopied
                    ? 'transform translate-y-0'
                    : 'transform translate-y-full'
                }`}
              >
                copied!
              </span>
            </button>
            {userIsAdmin && item.parsedId && (
              <AdminVisibilityToggle
                hru={item.parsedId}
                hidden={itemHidden}
                className="text-black hover:text-gray-700 underline text-sm select-none cursor-pointer"
              />
            )}
          </>
        )}
      </div>

      <div className="p-4 rounded-lg border border-gray-700 whitespace-pre-wrap bg-black text-gray-300 text-xs sm:text-sm font-code">
        {item.raw}
      </div>

      {/* <LastTimeItFound item={item} /> */}
    </div>
  );
}
