'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, StatCard, Panel, StatusPill } from '@/components';
import { GET_CUSTOMERS } from '@/queries/customer';
import { GET_PROJECTS } from '@/queries/project';
import { GET_SERVICES } from '@/queries/service';
import { LIST_SERVICES_BY_PROJET } from '@/queries/projectService';
import { GET_INVOICES } from '@/queries/invoice';
import { Settings, Camera, Lock, Package, Wrench, Code, Wifi } from 'lucide-react';

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
  CONTROLE_ACCES: "Contrôle d'accès",
  CONNEXION_INTERNET_RESEAUX: 'Connexion internet & réseaux',
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: 'Équipements informatiques',
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: 'Maintenance informatique',
};

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export default function Dashboard() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [projectServices, setProjectServices] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [customersData, projectsData, servicesData, invoicesData] = await Promise.all([
          request(API_URL, GET_CUSTOMERS, { pagination: { page: 1, limit: 100 } }),
          request(API_URL, GET_PROJECTS),
          request(API_URL, GET_SERVICES, { pagination: { page: 1, limit: 100 } }),
          request(API_URL, GET_INVOICES, { pagination: { page: 1, limit: 100 } }),
        ]);
        setCustomers(customersData.listCustomers?.items || []);
        setProjects(projectsData.listProjects || []);
        setServices(servicesData.listServices?.items || []);
        setInvoices(invoicesData.listInvoices?.items || []);

        if (projectsData.listProjects?.length > 0) {
          const allProjectServices: any[] = [];
          for (const proj of projectsData.listProjects.slice(0, 5)) {
            try {
              const psData = await request(API_URL, LIST_SERVICES_BY_PROJET, { projetId: proj.id });
              if (psData.listServicesByProjet) {
                allProjectServices.push(
                  ...psData.listServicesByProjet.map((ps: any) => ({ ...ps, projectTitle: proj.title }))
                );
              }
            } catch (e) {}
          }
          setProjectServices(allProjectServices);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeProjects = projects.filter((p: any) => p.status === 'EN_COURS').length;
  const pendingInvoices = invoices.filter((i: any) => i.statut === 'ENVOYEE').length;

  const totalRevenue = invoices
    .filter((i: any) => i.statut === 'PAYEE')
    .reduce((sum: number, i: any) => sum + (i.montantTTC || 0), 0);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  return (
    <AppLayout title="Tableau de bord">
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Clients actifs"
          value={customers.length}
          badge={{ text: '+3 ce mois', color: 'green' }}
        />
        <StatCard
          label="Projets en cours"
          value={activeProjects}
          badge={{ text: '2 en attente', color: 'blue' }}
        />
        <StatCard
          label="Factures émises"
          value={invoices.length}
          badge={{ text: `${pendingInvoices} en attente`, color: 'amber' }}
        />
        <StatCard
          label="CA ce mois (FCFA)"
          value={formatCurrency(totalRevenue)}
          badge={{ text: '+18%', color: 'green' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Panel title="Services du catalogue" link="Voir tout" href="/services">
          {services.slice(0, 5).map((service: any) => {
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
                <StatusPill status={service.statut} />
              </div>
            );
          })}
          {services.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[#888780]">Aucun service disponible</div>
          )}
        </Panel>

        <Panel title="Factures récentes" link="Voir tout" href="/factures">
          {invoices.slice(0, 5).map((invoice: any) => (
            <div key={invoice.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
              <div>
                <div className="text-[12px] font-medium text-[#1A1A1A]">{invoice.numero}</div>
                <div className="text-[11px] text-[#888780]">Client #{invoice.customerId}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-medium text-[#1A1A1A]">{invoice.montantTTC?.toLocaleString() || 0} FCFA</div>
                <StatusPill status={invoice.statut} />
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[#888780]">Aucune facture disponible</div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Panel title="Projets actifs" link="Voir tout" href="/projets">
          {projects.slice(0, 4).map((project: any) => (
            <div key={project.id} className="px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
              <div className="flex justify-between items-center">
                <div className="text-[12px] font-medium text-[#1A1A1A]">{project.title}</div>
                <StatusPill status={project.status} />
              </div>
              <div className="text-[11px] text-[#888780]">{project.customer?.entreprise || `Client #${project.customerId}`}</div>
              <div className="h-1 rounded-full bg-[#E5E4E0] mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: project.status === 'TERMINE' ? '100%' : project.status === 'EN_COURS' ? '50%' : '0%',
                    backgroundColor: project.status === 'TERMINE' ? '#639922' : project.status === 'EN_ATTENTE' ? '#EF9F27' : '#378ADD',
                  }}
                />
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[#888780]">Aucun projet disponible</div>
          )}
        </Panel>

        <Panel title="Services par projet" link="Voir tout" href="/projets">
          {projectServices.slice(0, 6).map((ps: any) => {
            const service = services.find((s: any) => s.id === ps.serviceId);
            const iconConfig = service
              ? serviceIcons[service.nom] || { icon: Settings, bg: 'bg-gray-100', color: 'text-gray-600' }
              : { icon: Settings, bg: 'bg-gray-100', color: 'text-gray-600' };
            const Icon = iconConfig.icon;
            return (
              <div key={ps.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-[30px] h-[30px] rounded-md flex items-center justify-center ${iconConfig.bg}`}>
                    <Icon className={`w-[13px] h-[13px] ${iconConfig.color}`} />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-[#1A1A1A]">
                      {service ? serviceNames[service.nom] || service.nom : `Service #${ps.serviceId}`}
                    </div>
                    <div className="text-[11px] text-[#888780]">{ps.projectTitle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-medium text-[#1A1A1A]">{ps.quantite} x {ps.prixUnitaire?.toLocaleString()}</div>
                  <div className="text-[11px] text-[#888780]">{ps.montantTotal?.toLocaleString()} FCFA</div>
                </div>
              </div>
            );
          })}
          {projectServices.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[#888780]">Aucun service lié à un projet</div>
          )}
        </Panel>

        <Panel title="Revenus par service" link="Détail" href="/services">
          <div className="py-2">
            {services.slice(0, 6).map((service: any, index: number) => {
              const colors = ['bg-[#378ADD]', 'bg-[#1D9E75]', 'bg-[#7F77DD]', 'bg-[#EF9F27]', 'bg-[#D85A30]', 'bg-[#888780]'];
              const maxRevenue = 1800000;
              const revenue = [1800000, 1200000, 850000, 620000, 400000, 280000][index] || 100000;
              const percentage = (revenue / maxRevenue) * 100;
              return (
                <div key={service.id} className="flex items-center gap-2 px-4 py-1.5">
                  <span className="text-[11px] text-[#5F5E5A] w-[140px] truncate">{serviceNames[service.nom] || service.nom}</span>
                  <div className="flex-1 h-2.5 bg-[#F7F6F3] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[index]}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[11px] text-[#888780] w-10 text-right">{formatCurrency(revenue)}</span>
                </div>
              );
            })}
            {services.length === 0 && (
              <div className="px-4 py-8 text-center text-[13px] text-[#888780]">Aucune donnée disponible</div>
            )}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}