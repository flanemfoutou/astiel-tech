'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, StatusPill } from '@/components';
import { GET_PROJECTS } from '@/queries/project';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export default function ProjetsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(API_URL, GET_PROJECTS);
        setProjects(data.listProjects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AppLayout title="Projets">
      <Panel title="Liste des projets" link="Voir tout">
        {projects.map((project: any) => (
          <div key={project.id} className="px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
            <div className="flex justify-between items-center">
              <div className="text-[12px] font-medium text-[#1A1A1A]">{project.title}</div>
              <StatusPill status={project.status} />
            </div>
            <div className="text-[11px] text-[#888780] mt-1">
              {project.customer?.entreprise || `Client #${project.customerId}`}
            </div>
            {project.description && (
              <div className="text-[11px] text-[#5F5E5A] mt-1">{project.description}</div>
            )}
            <div className="h-1 rounded-full bg-[#E5E4E0] mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: project.status === 'TERMINE' ? '100%' : project.status === 'EN_COURS' ? '50%' : '0%',
                  backgroundColor: project.status === 'TERMINE' ? '#639922' : project.status === 'EN_ATTENTE' ? '#EF9F27' : '#378ADD'
                }}
              />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-[#888780]">
            Aucun projet trouvé
          </div>
        )}
      </Panel>
    </AppLayout>
  );
}
