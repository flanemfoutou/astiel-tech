'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function AppLayout({ children, title }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#F1EFE8]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E5E4E0] px-5 py-3 flex items-center justify-between">
          <h2 className="text-[16px] font-medium text-[#1A1A1A]">{title}</h2>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1.5 rounded-md text-[13px] border border-[#D1D0CC] bg-white text-[#1A1A1A]">
              Exporter
            </button>
            <button className="px-3 py-1.5 rounded-md text-[13px] bg-[#185FA5] text-white border border-[#185FA5]">
              + Nouveau
            </button>
          </div>
        </header>
        <div className="flex-1 p-5 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
