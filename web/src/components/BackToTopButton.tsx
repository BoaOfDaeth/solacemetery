 'use client';

import { useEffect, useState } from 'react';

export default function BackToTopButton({
  showAfterPx = 400,
}: {
  showAfterPx?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > showAfterPx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfterPx]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-24 right-6 lg:bottom-6 z-40 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary/20 bg-transparent hover:bg-transparent text-primary border border-primary md:cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className="overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M12 5l-7 7m7-7l7 7M12 5v14"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </button>
  );
}

