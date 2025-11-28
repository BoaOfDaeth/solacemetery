'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { hideParsedItem, restoreParsedItem } from '@/app/actions/visibility';

interface AdminVisibilityToggleProps {
  hru: string;
  hidden: boolean;
  className?: string;
}

export default function AdminVisibilityToggle({
  hru,
  hidden,
  className,
}: AdminVisibilityToggleProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const label = hidden ? 'restore' : 'delete';

  const handleClick = () => {
    // If already pending, ignore the click
    if (isPending) {
      return;
    }

    // Run action instantly
    startTransition(async () => {
      if (hidden) {
        await restoreParsedItem(hru);
      } else {
        await hideParsedItem(hru);
      }

      mutate(
        key => typeof key === 'string' && key.startsWith('/api/search'),
        undefined,
        { revalidate: true }
      );
      router.refresh();
    });
  };

  const defaultClassName =
    'text-black hover:text-gray-700 underline text-sm select-none cursor-pointer';
  const baseClassName = className || defaultClassName;

  // Remove underline when saving, keep it otherwise
  const finalClassName = isPending
    ? baseClassName.replace('underline', '').trim()
    : baseClassName;

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${finalClassName} ${isPending ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
    >
      {label}
    </button>
  );
}
