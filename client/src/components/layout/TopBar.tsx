'use client';

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex items-center justify-between h-16 px-6">
      {/* Left: Mobile menu + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-[10px] hover:bg-neutral-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-neutral-600" />
        </button>
        <div>
          <p className="text-sm font-medium text-neutral-800">
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'there'}
          </p>
          <p className="text-xs text-neutral-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: Avatar + Logout */}
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs">
            {user?.fullName ? getInitials(user.fullName) : 'U'}
          </AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" onClick={logout} className="h-9 w-9">
          <LogOut className="w-4 h-4 text-neutral-500" />
        </Button>
      </div>
    </div>
  );
}
