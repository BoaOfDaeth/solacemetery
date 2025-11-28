'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompareStore } from '@/store/compareStore';
import AuthButton from '@/components/AuthButton';
import type { AuthUser } from '@/lib/auth';

interface ToolbarProps {
  user: AuthUser | null;
}

export default function Toolbar({ user }: ToolbarProps) {
  const { selectedItems, clearItems } = useCompareStore();
  const router = useRouter();

  const handleCompareClick = () => {
    if (selectedItems.length > 0) {
      const itemsParam = selectedItems.join(',');
      router.push(`/compare?items=${itemsParam}`);
    } else {
      router.push('/compare');
    }
  };

  const handleClearClick = () => {
    clearItems();
  };

  return (
    <div className="bg-gray-800 shadow-lg w-full sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 w-full">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center text-white hover:text-gray-200 transition-colors flex-shrink-0"
          >
            <div className="text-sm leading-tight font-semibold">
              <div>Solace MUD</div>
              <div>Items DB</div>
            </div>
          </Link>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={handleCompareClick}
              className="text-white text-sm hover:text-gray-200 transition-colors cursor-pointer select-none"
            >
              Compare {selectedItems.length > 0 && `(${selectedItems.length})`}
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleClearClick}
                className="text-red-400 text-sm hover:text-red-300 transition-colors cursor-pointer select-none"
              >
                Clear All
              </button>
            )}

            <AuthButton user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
