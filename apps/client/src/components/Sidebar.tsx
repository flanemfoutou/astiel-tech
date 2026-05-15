'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderKanban, Package, FileText } from 'lucide-react';

const AsTiellLogo = () => (
  <svg width="140" height="50" viewBox="0 0 140 50" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="70" cy="27" rx="68" ry="22" fill="none" stroke="#1B2A6B" strokeWidth="2" />
    <g transform="translate(18, 6)">
      <circle cx="20" cy="20" r="5" fill="none" stroke="#1B9AA0" strokeWidth="2" />
      <circle cx="20" cy="20" r="2" fill="#1B9AA0" />
      <path d="M12,12 Q20,4 28,12" fill="none" stroke="#1B9AA0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8,8 Q20,-2 32,8" fill="none" stroke="#1B2A6B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5,5 Q20,-7 35,5" fill="none" stroke="#1B9AA0" strokeWidth="1" strokeLinecap="round" strokeDasharray="2,2" />
      <polygon points="20,2 15,12 25,12" fill="#1B9AA0" opacity="0.85" />
      <line x1="20" y1="25" x2="20" y2="32" stroke="#1B2A6B" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="32" x2="26" y2="32" stroke="#1B2A6B" strokeWidth="2" strokeLinecap="round" />
    </g>
    <text x="90" y="26" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fontWeight="bold">
      <tspan fill="#1B2A6B">As</tspan>
      <tspan fill="#1B9AA0">T</tspan>
      <tspan fill="#1B2A6B">iell</tspan>
    </text>
    <text x="90" y="36" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill="#1B9AA0" letterSpacing="1.5">
      Services
    </text>
    <text x="90" y="44" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="5" fill="#1B2A6B" letterSpacing="2">
      ── SARL ──
    </text>
  </svg>
);

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
      <div className="pb-4 border-b border-[#E5E4E0] mb-3">
        <AsTiellLogo />
        <p className="text-[10px] text-[#888780] mt-1 text-center">Ingénierie des TIC – Commerce Général</p>
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
