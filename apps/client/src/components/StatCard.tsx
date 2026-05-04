interface StatCardProps {
  label: string;
  value: string | number;
  badge?: {
    text: string;
    color: 'green' | 'amber' | 'blue' | 'red';
  };
}

const badgeStyles = {
  green: 'bg-[#EAF3DE] text-[#3B6D11]',
  amber: 'bg-[#FAEEDA] text-[#854F0B]',
  blue: 'bg-[#E6F1FB] text-[#185FA5]',
  red: 'bg-[#FCEBEB] text-[#A32D2D]',
};

export function StatCard({ label, value, badge }: StatCardProps) {
  return (
    <div className="bg-[#F7F6F3] rounded-md p-3.5">
      <div className="text-[11px] text-[#888780] mb-1.5">{label}</div>
      <div className="text-[22px] font-medium text-[#1A1A1A]">{value}</div>
      {badge && (
        <div className="mt-1">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block ${badgeStyles[badge.color]}`}>
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
}
