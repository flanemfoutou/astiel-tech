'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, StatusPill } from '@/components';
import { GET_SERVICES } from '@/queries/service';
import { Settings, Camera, Lock, Globe, Package, Wrench, Code, Wifi } from 'lucide-react';

const serviceIcons: Record<string, { icon: typeof Settings; bg: string; color: string }> = {
  DEVELOPPEMENT_APP_WEB_MOBILE: { icon: Code, bg: 'bg-[#E6F1FB]', color: 'text-[#185FA5]' },
  VIDEOSURVEILLANCE_CCTV: { icon: Camera, bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]' },
  CONTROLE_ACCES: { icon: Lock, bg: 'bg-[#FAEEDA]', color: 'text-[#854F0B]' },
  CONNEXION_INTERNET_RESEAUX: { icon: Wifi, bg: 'bg-[#EEEDFE]', color: 'text-[#534AB7]' },
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: { icon: Package, bg: 'bg-[#FCEBEB]', color: 'text-[#A32D2D]' },
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: { icon: Wrench, bg: 'bg-[#E1F5EE]', color: 'text-[#0F6E56]' },
};

const serviceNames: Record<string, string> = {
  DEVELOPPEMENT_APP_WEB_MOBILE: 'Développement web & mobile',
  VIDEOSURVEILLANCE_CCTV: 'Vidéosurveillance (CCTV)',
  CONTROLE_ACCES: 'Contrôle d\'accès',
  CONNEXION_INTERNET_RESEAUX: 'Connexion internet & réseaux',
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: 'Équipements informatiques',
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: 'Maintenance informatique',
};

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(API_URL, GET_SERVICES, { pagination: { page: 1, limit: 100 } });
        setServices(data.listServices?.items || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AppLayout title="Services">
      <Panel title="Catalogue des services" link="Voir tout">
        {services.map((service: any) => {
          const iconConfig = serviceIcons[service.nom] || { icon: Settings, bg: 'bg-gray-100', color: 'text-gray-600' };
          const Icon = iconConfig.icon;
          return (
            <div key={service.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-[30px] h-[30px] rounded-md flex items-center justify-center ${iconConfig.bg}`}>
                  <Icon className={`w-[13px] h-[13px] ${iconConfig.color}`} />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#1A1A1A]">{serviceNames[service.nom] || service.nom}</div>
                  <div className="text-[11px] text-[#888780]">{service.categorie}</div>
                </div>
              </div>
              <div className="text-right">
                {service.tarifJournalier && (
                  <div className="text-[12px] font-medium text-[#1A1A1A]">{service.tarifJournalier.toLocaleString()} FCFA/jour</div>
                )}
                <StatusPill status={service.statut} />
              </div>
            </div>
          );
        })}
        {services.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-[#888780]">
            Aucun service trouvé
          </div>
        )}
      </Panel>
    </AppLayout>
  );
}
