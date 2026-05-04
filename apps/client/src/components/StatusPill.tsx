interface StatusPillProps {
  status: string;
  customColor?: string;
  customBg?: string;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  ACTIF: { bg: 'bg-[#EAF3DE]', text: 'text-[#3B6D11]' },
  INACTIF: { bg: 'bg-[#F1EFE8]', text: 'text-[#5F5E5A]' },
  BLOQUE: { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]' },
  PAYÉE: { bg: 'bg-[#EAF3DE]', text: 'text-[#3B6D11]' },
  ENVOYÉE: { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' },
  BROUILLON: { bg: 'bg-[#F1EFE8]', text: 'text-[#5F5E5A]' },
  ANNULÉE: { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]' },
  EN_COURS: { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' },
  EN_ATTENTE: { bg: 'bg-[#FAEEDA]', text: 'text-[#854F0B]' },
  TERMINE: { bg: 'bg-[#EAF3DE]', text: 'text-[#3B6D11]' },
  ANNULE: { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]' },
};

export function StatusPill({ status, customColor, customBg }: StatusPillProps) {
  const style = statusStyles[status] || { bg: 'bg-[#F1EFE8]', text: 'text-[#5F5E5A]' };
  
  return (
    <span 
      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ 
        backgroundColor: customBg || style.bg, 
        color: customColor || style.text 
      }}
    >
      {status}
    </span>
  );
}
