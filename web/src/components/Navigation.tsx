'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  cta?: React.ReactNode;
  items: NavItem[];
  variant?: 'header' | 'floating';
}

export default function Navigation({
  cta,
  items,
  variant = 'header',
}: NavigationProps) {
  const [open, setOpen] = useState(false);

  const openButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const dialogId = useId();

  // Focus management
  useEffect(() => {
    if (open) {
      // Focus on first menu item when menu opens
      const firstMenuItem = drawerRef.current?.querySelector('a, button');
      if (firstMenuItem instanceof HTMLElement) {
        firstMenuItem.focus();
      }
    } else {
      openButtonRef.current?.focus();
    }
  }, [open]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

  const closeDrawer = () => setOpen(false);

  // Floating variant - button stays, menu appears below
  if (variant === 'floating') {
    return (
      <>
        {/* Burger Button - Always visible */}
        <button
          ref={openButtonRef}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={dialogId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            open 
              ? 'bg-transparent hover:bg-transparent text-primary border border-primary' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            width="24" height="24"
            className="overflow-visible"
          >
            {/* top */}
            <line
              x1="4" y1="7" x2="20" y2="7"
              className="stroke-current"
              strokeWidth="2" strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* middle */}
            <line
              x1="4" y1="12" x2="20" y2="12"
              className="stroke-current"
              strokeWidth="2" strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* bottom */}
            <line
              x1="4" y1="17" x2="20" y2="17"
              className="stroke-current"
              strokeWidth="2" strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </button>

        {/* Floating Menu - Appears below button */}
        {open && (
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            id={dialogId}
            className="fixed bottom-4 right-4 z-40 w-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-2xl shadow-2xl border border-border/40 transform transition-all duration-300 ease-out"
          >
            {/* Menu content */}
            <div className="p-3">
              <nav className="space-y-1">
                {items.slice().reverse().map((item, index) => (
                  <CompactMobileNavItem
                    key={items.length - 1 - index}
                    item={item}
                    onClose={closeDrawer}
                  />
                ))}
              </nav>

              {/* Mobile CTA */}
              {cta && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  {cta}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Header variant - desktop navigation bar
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center h-18">
        <nav className="flex items-center space-x-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Compact mobile navigation item for floating menu
function CompactMobileNavItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="block px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 focus:outline-none transition-colors"
    >
      {item.label}
    </Link>
  );
}
