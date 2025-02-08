'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  Star, 
  Gift, 
  LayoutDashboard, 
  Bot,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    label: 'Avatar Profile',
    icon: User,
    path: '/quiz',
  },
  {
    label: 'Review Hub',
    icon: Star,
    path: '/reviews',
  },
  {
    label: 'Rewards',
    icon: Gift,
    path: '/rewards',
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: 'Miss Dappai',
    icon: Bot,
    path: '/directory',
  },
];

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show tab bar on landing page
  if (pathname === '/') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <nav className="flex justify-around items-center h-16 max-w-screen-sm mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  )
} 