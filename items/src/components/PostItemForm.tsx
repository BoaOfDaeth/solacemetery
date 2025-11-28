'use client';

import { useState, useTransition } from 'react';
import { postItem } from '@/app/actions/postItem';

export default function PostItemForm() {
  const [isPending, startTransition] = useTransition();
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!raw.trim()) {
      setError('Item data is required');
      return;
    }

    startTransition(async () => {
      try {
        const result = await postItem(raw.trim());

        if (result.success) {
          setSuccess(true);
          setRaw('');
        } else {
          setError(result.error || 'Failed to post item');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-gray-500">
        Paste the complete item description as received from the game.
      </p>
      <div>
        <textarea
          id="raw"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          rows={15}
          className="w-full px-4 py-4 border border-gray-700 rounded-lg bg-black text-gray-300 text-xs sm:text-sm font-code placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-600"
          placeholder={`.. this object, a reinforced iron halberd, is a polearm,
and can be referred to as 'halberd iron reinforced'.
It is of 25th level, weighs 11 pounds, and is worth 10 gold.
It deals 4d7 damage (averaging at 16).
Its attacks take the form of a charge.
It is designed to be used with two hands.
When worn, it 
  modifies hit roll by 2
  modifies damage roll by 6`}
          disabled={isPending}
          required
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">
          Each new item added to the database gives{' '}
          <span className="font-bold">1 point</span> to the poster on the
          leaderboard.
        </p>
        <p className="text-xs text-gray-500 mb-1">
          Which items won&apos;t be seen/posted by default:
        </p>
        <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
          <li>Level 1 items</li>
          <li>Corpses, keys, etc.</li>
          <li>Wands, staves, scrolls, pills</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={isPending || !raw.trim()}
          className="px-6 py-2 h-[60px] bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          Submit
        </button>

        <div className="flex-1 min-w-0 h-[60px] flex items-center">
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-lg w-full h-full flex items-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg w-full h-full flex items-center">
              Your item has been added to the submission queue and will be
              processed shortly.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
