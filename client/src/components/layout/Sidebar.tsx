'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from '@/constants/navigation';

interface SidebarProps {
  items: NavItem[];
  title: string;
  subtitle?: string;
}

export function Sidebar({ items, title, subtitle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <Image
          src="/assets/BuddyAi Logo.png"
          alt="BuddyAI"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="h-auto w-[76px]"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-primary-500' : 'text-neutral-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-neutral-400">BuddyAI v1.0</p>
      </div>
    </div>
  );
}
