'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, Package, FileText } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard, color: 'bg-blue-500' },
  { href: '/clients', label: 'Clients', icon: Users, color: 'bg-teal-500' },
  { href: '/projets', label: 'Projets', icon: FolderKanban, color: 'bg-purple-500' },
  { href: '/services', label: 'Services', icon: Package, color: 'bg-amber-500' },
  { href: '/factures', label: 'Factures', icon: FileText, color: 'bg-coral-500' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] min-w-[200px] bg-white border-r border-[#E5E4E0] flex flex-col p-4">
      <div className="pb-5 border-b border-[#E5E4E0] mb-3">
        <h1 className="text-[15px] font-medium text-[#1A1A1A]">Astiell Tech</h1>
        <p className="text-[11px] text-[#888780]">Gestion commerciale</p>
      </div>
      
      <nav className="space-y-1">
        <div className="px-2 pt-2 pb-1">
          <span className="text-[10px] text-[#888780] uppercase tracking-wide">Principal</span>
        </div>
        {navItems.slice(0, 3).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2 py-[7px] rounded-md text-[13px] transition-colors ${
                isActive
                  ? 'bg-[#E6F1FB] text-[#185FA5] font-medium'
                  : 'text-[#5F5E5A] hover:bg-[#F7F6F3]'
              }`}
            >
              <span className={`w-[7px] h-[7px] rounded-full ${item.color}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav className="space-y-1 mt-2">
        <div className="px-2 pt-2 pb-1">
          <span className="text-[10px] text-[#888780] uppercase tracking-wide">Catalogue</span>
        </div>
        {navItems.slice(3).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2 py-[7px] rounded-md text-[13px] transition-colors ${
                isActive
                  ? 'bg-[#E6F1FB] text-[#185FA5] font-medium'
                  : 'text-[#5F5E5A] hover:bg-[#F7F6F3]'
              }`}
            >
              <span className={`w-[7px] h-[7px] rounded-full ${item.color}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
