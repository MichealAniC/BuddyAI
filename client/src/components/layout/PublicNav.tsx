'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
];

export function PublicNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      <nav
        className={cn(
          'w-full border-b border-border/50 bg-surface-elevated/60 backdrop-blur-xl',
          'supports-[backdrop-filter]:bg-surface-elevated/40',
          'transition-all duration-300'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="BuddyAI home">
            <Image
              src="/assets/BuddyAi_Logo-removebg-preview.png"
              alt="BuddyAI"
              width={0}
              height={0}
              sizes="100vw"
              priority
              className="h-auto w-[84px] sm:w-[98px]"
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => {
                const active =
                  link.href.startsWith('/') &&
                  !link.href.includes('#') &&
                  pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-sm font-medium transition-colors duration-200',
                        active
                          ? 'text-primary-600'
                          : 'text-text-muted hover:text-primary-600'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Link
                href="/register"
                className="inline-flex items-center justify-center border-0 bg-primary-600 text-white rounded-button px-5 py-2 text-sm font-medium hover:bg-primary-700 transition-all duration-200 no-underline shadow-card hover:shadow-elevated"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-button text-text-muted hover:bg-surface-secondary transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
            mobileOpen
              ? 'max-h-[360px] opacity-100'
              : 'max-h-0 opacity-0'
          )}
        >
          <div className="border-t border-border/50 bg-surface-elevated/90 backdrop-blur-xl px-6 py-4 space-y-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="block rounded-button px-3 py-2 text-sm font-medium text-text hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
              <Button variant="outline" asChild>
                <Link href="/login" onClick={handleLinkClick}>Login</Link>
              </Button>
              <Link
                href="/register"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center border-0 bg-primary-600 text-white rounded-button px-5 py-2 text-sm font-medium hover:bg-primary-700 transition-all duration-200 no-underline shadow-card hover:shadow-elevated"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
