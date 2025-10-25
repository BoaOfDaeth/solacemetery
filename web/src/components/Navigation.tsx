'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
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
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const openButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const dialogId = useId();
  const menuId = useId();

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
      if (e.key === 'Escape') {
        if (open) {
          setOpen(false);
        } else if (openDropdown !== null) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, openDropdown]);

  const handleDropdownBlur = (e: React.FocusEvent) => {
    // Close dropdown if focus leaves the dropdown tree
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node;

    if (!currentTarget.contains(relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

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
      <div className="flex items-center justify-center h-12">
        <nav className="flex items-center space-x-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative"
              onBlur={handleDropdownBlur}
              onMouseLeave={handleDropdownMouseLeave}
            >
              {item.children ? (
                <>
                  <button
                    className="flex items-center px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    onClick={() => handleDropdownToggle(index)}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === index}
                    aria-controls={`${menuId}-${index}`}
                  >
                    {item.label}
                    <svg
                      className={`ml-1 h-4 w-4 transition-transform ${
                        openDropdown === index ? 'rotate-180' : 'rotate-0'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div
                    id={`${menuId}-${index}`}
                    role="menu"
                    aria-label={`${item.label} submenu`}
                    className={`absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-xl transition-opacity duration-200 ${
                      openDropdown === index
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="py-2">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href || '#'}
                          className="block px-4 py-2 text-sm text-card-foreground hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
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
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const buttonId = useId();

  if (!item.children) {
    return (
      <Link
        href={item.href || '#'}
        onClick={onClose}
        className="block px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 focus:outline-none transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        id={buttonId}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-primary rounded-lg hover:bg-primary/10 focus:outline-none transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {item.label}
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden transition-[max-height] duration-200 ${
          isOpen ? 'max-h-48' : 'max-h-0'
        }`}
      >
        <div className="pl-3 pt-1 space-y-1">
          {item.children.map((child, childIndex) => (
            <Link
              key={childIndex}
              href={child.href || '#'}
              onClick={onClose}
              className="block px-3 py-1.5 text-xs text-primary/80 rounded-md hover:bg-primary/10 focus:outline-none transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
