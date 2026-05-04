'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, StatusPill } from '@/components';
import { GET_INVOICES } from '@/queries/invoice';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(API_URL, GET_INVOICES, { pagination: { page: 1, limit: 100 } });
        setInvoices(data.listInvoices?.items || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <AppLayout title="Factures">
      <Panel title="Liste des factures" link="Voir tout">
        {invoices.map((invoice: any) => (
          <div key={invoice.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E4E0] last:border-b-0">
            <div>
              <div className="text-[12px] font-medium text-[#1A1A1A]">{invoice.numero}</div>
              <div className="text-[11px] text-[#888780]">Client #{invoice.customerId}</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-[#1A1A1A]">{invoice.montantTTC?.toLocaleString() || 0} FCFA</div>
              <div className="text-[11px] text-[#888780]">Échéance: {formatDate(invoice.dateEcheance)}</div>
            </div>
            <StatusPill status={invoice.statut} />
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="px-4 py-12 text-center text-[13px] text-[#888780]">
            Aucune facture trouvée
          </div>
        )}
      </Panel>
    </AppLayout>
  );
}
