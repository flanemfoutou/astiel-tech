import { ReactNode } from 'react';

interface PanelProps {
  title: string;
  link?: string;
  children: ReactNode;
}

export function Panel({ title, link, children }: PanelProps) {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E5E4E0] flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#1A1A1A]">{title}</span>
        {link && (
          <span className="text-[12px] text-[#185FA5] cursor-pointer hover:underline">
            {link}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
