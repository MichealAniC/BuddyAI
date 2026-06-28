import {
  Home,
  MessageCircle,
  TrendingUp,
  Heart,
  User,
  LayoutDashboard,
  Users,
  Bell,
  FolderOpen,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const studentNavItems: NavItem[] = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Buddy', href: '/buddy', icon: MessageCircle },
  { label: 'Journey', href: '/journey', icon: TrendingUp },
  { label: 'Support', href: '/support', icon: Heart },
  { label: 'Profile', href: '/profile', icon: User },
];

export const counsellorNavItems: NavItem[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Students', href: '/students', icon: Users },
  { label: 'Alerts', href: '/alerts', icon: Bell },
  { label: 'Cases', href: '/cases', icon: FolderOpen },
  { label: 'Reports', href: '/analytics', icon: BarChart3 },
];
