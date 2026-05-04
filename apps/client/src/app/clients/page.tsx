'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, StatusPill } from '@/components';
import { GET_CUSTOMERS } from '@/queries/customer';
import { User, Mail, Phone, Building } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export default function ClientsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(API_URL, GET_CUSTOMERS, { pagination: { page: 1, limit: 100 } });
        setCustomers(data.listCustomers?.items || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getAvatarColor = (index: number) => {
    const colors = ['bg-[#E6F1FB] text-[#185FA5]', 'bg-[#E1F5EE] text-[#0F6E56]', 'bg-[#EEEDFE] text-[#534AB7]', 'bg-[#FAECE7] text-[#993C1D]'];
    return colors[index % colors.length];
  };

  const getInitials = (nom: string, prenom: string) => {
    return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
  };

  return (
    <AppLayout title="Clients">
      <Panel title="Liste des clients" link="Voir tout">
        {customers.map((customer: any, index: number) => (
          <div key={customer.id} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
            <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-medium ${getAvatarColor(index)}`}>
              {getInitials(customer.nom, customer.prenom)}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[#1A1A1A]">{customer.nomComplet}</div>
              <div className="text-[11px] text-[#888780]">{customer.entreprise || 'Particulier'}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#5F5E5A] flex items-center gap-1 justify-end">
                <Mail className="w-3 h-3" />
                {customer.email}
              </div>
              <div className="text-[11px] text-[#888780] flex items-center gap-1 justify-end">
                <Phone className="w-3 h-3" />
                {customer.telephone}
              </div>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-[#888780]">
            Aucun client trouvé
          </div>
        )}
      </Panel>
    </AppLayout>
  );
}
