'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import {
  AppLayout, Panel, StatusPill, Button, Modal, FormField,
  Input, TextArea, Select, LoadingSpinner, EmptyState, ConfirmDialog
} from '@/components';
import { GET_INVOICES, CREATE_INVOICE, CHANGER_STATUT_INVOICE, DELETE_INVOICE } from '@/queries/invoice';
import { LIST_SERVICES_BY_PROJET } from '@/queries/projectService';
import { GET_PROJECTS } from '@/queries/project';
import { GET_CUSTOMERS } from '@/queries/customer';
import { GET_SERVICES } from '@/queries/service';
import { gql } from 'graphql-request';
import {
  Plus, Trash2, Search, FileText, Send, Check,
  ArrowLeft, ArrowRight, AlertCircle, Printer,
  FileDown, FileSpreadsheet
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const ENTREPRISE = {
  nom: 'AsTiell Services SARL',
  activite: "Ingénierie des Technologies de l'Information et de la Communication – Commerce Général – Génie Civil – Logistique",
  adresse: '34, Rue des Alouettes/Mabiala Salomon – La Base, Moungali – Brazzaville, République du Congo',
  telephone: '+242 05 513 13 12 / 06 490 47 66',
  email: 'contact@astiellservices.com',
  banque: 'N° Compte BCH : 30015 24205 10120002765-18',
  rccm: 'RCCM : CG-BZV-01-2023-B12-00097',
  niu: 'NIU : M230000003017846',
  scien: 'SCIEN : 2010221 – SCIET : 2010221014',
};

const AsTiellLogo = () => (
  <svg width="150" height="65" viewBox="0 0 150 65" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="75" cy="35" rx="72" ry="24" fill="none" stroke="#1B2A6B" strokeWidth="2.5" />
    <g transform="translate(22, 8)">
      <circle cx="20" cy="20" r="5" fill="none" stroke="#1B9AA0" strokeWidth="2" />
      <circle cx="20" cy="20" r="2" fill="#1B9AA0" />
      <path d="M12,12 Q20,4 28,12" fill="none" stroke="#1B9AA0" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8,8 Q20,-2 32,8" fill="none" stroke="#1B2A6B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5,5 Q20,-7 35,5" fill="none" stroke="#1B9AA0" strokeWidth="1" strokeLinecap="round" strokeDasharray="2,2" />
      <polygon points="20,2 15,12 25,12" fill="#1B9AA0" opacity="0.85" />
      <line x1="20" y1="25" x2="20" y2="32" stroke="#1B2A6B" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="32" x2="26" y2="32" stroke="#1B2A6B" strokeWidth="2" strokeLinecap="round" />
    </g>
    <text x="95" y="32" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fontWeight="bold">
      <tspan fill="#1B2A6B">As</tspan><tspan fill="#1B9AA0">T</tspan><tspan fill="#1B2A6B">iell</tspan>
    </text>
    <text x="95" y="44" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fill="#1B9AA0" letterSpacing="1.5">Services</text>
    <text x="95" y="54" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="#1B2A6B" letterSpacing="2.5">── SARL ──</text>
  </svg>
);

const GET_INVOICE_DETAIL = gql`
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
      id numero reference idClient description
      projetId customerId statut
      dateEmission dateEcheance montantHT tauxTVA montantTVA montantTTC notes
      items {
        id designation quantite prixUnitaire montantTotal projectServiceId
      }
    }
  }
`;

const serviceNames: Record<string, string> = {
  DEVELOPPEMENT_APP_WEB_MOBILE: 'Développement web & mobile',
  VIDEOSURVEILLANCE_CCTV: 'Vidéosurveillance (CCTV)',
  CONTROLE_ACCES: "Contrôle d'accès",
  CONNEXION_INTERNET_RESEAUX: 'Connexion internet & réseaux',
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: 'Équipements informatiques',
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: 'Maintenance informatique',
  FOURNITURE_CONSOMMABLES_TELECOM: 'Fourniture consommables télécom',
};

const statutLabels: Record<string, string> = {
  BROUILLON: 'Brouillon', ENVOYEE: 'Envoyée', PAYEE: 'Payée', ANNULEE: 'Annulée',
};

const statutColors: Record<string, { bg: string; color: string }> = {
  BROUILLON: { bg: '#F7F6F3', color: '#5F5E5A' },
  ENVOYEE: { bg: '#E6F1FB', color: '#185FA5' },
  PAYEE: { bg: '#E1F5EE', color: '#0F6E56' },
  ANNULEE: { bg: '#FCEBEB', color: '#A32D2D' },
};

// Convertit un montant en lettres (FCFA)
function montantEnLettres(montant: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

  if (montant === 0) return 'zéro franc CFA';

  function convertGroup(n: number): string {
    if (n === 0) return '';
    if (n < 20) return units[n];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      if (t === 7) return 'soixante-' + units[10 + u];
      if (t === 9) return 'quatre-vingt-' + (u === 0 ? '' : units[u]);
      return tens[t] + (u === 1 && t !== 8 ? '-et-un' : u === 0 ? '' : '-' + units[u]);
    }
    const h = Math.floor(n / 100);
    const r = n % 100;
    const centStr = h === 1 ? 'cent' : units[h] + ' cent';
    return centStr + (r === 0 ? '' : ' ' + convertGroup(r));
  }

  const millions = Math.floor(montant / 1000000);
  const milliers = Math.floor((montant % 1000000) / 1000);
  const reste = montant % 1000;

  let result = '';
  if (millions > 0) result += convertGroup(millions) + (millions === 1 ? ' million ' : ' millions ');
  if (milliers > 0) result += (milliers === 1 ? 'mille ' : convertGroup(milliers) + ' mille ');
  if (reste > 0) result += convertGroup(reste);

  return result.trim().charAt(0).toUpperCase() + result.trim().slice(1) + ' francs CFA';
}

const initialStep1 = {
  projetId: '', customerId: '', dateEcheance: '', tauxTVA: 18, notes: '',
  reference: '', idClient: '', description: '',
};

type LignePreview = {
  id: string; serviceId: string; designation: string;
  quantite: number; prixUnitaire: number; montantTotal: number;
};

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState(initialStep1);
  const [lignes, setLignes] = useState<LignePreview[]>([]);
  const [loadingLignes, setLoadingLignes] = useState(false);
  const [lignesError, setLignesError] = useState('');

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [invoiceToPrint, setInvoiceToPrint] = useState<any>(null);
  const [printItems, setPrintItems] = useState<any[]>([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [invoicesData, projectsData, customersData, servicesData] = await Promise.all([
        request(API_URL, GET_INVOICES, { pagination: { page: 1, limit: 100 } }),
        request(API_URL, GET_PROJECTS),
        request(API_URL, GET_CUSTOMERS, { pagination: { page: 1, limit: 100 } }),
        request(API_URL, GET_SERVICES, { pagination: { page: 1, limit: 100 } }),
      ]);
      setInvoices((invoicesData as any).listInvoices?.items || []);
      setProjects((projectsData as any).listProjects || []);
      setCustomers((customersData as any).listCustomers?.items || []);
      setServices((servicesData as any).listServices?.items || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredInvoices = invoices.filter((i: any) =>
    i.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(i.customerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getCustomerName(customerId: string) {
    const c = customers.find((c: any) => c.id === customerId);
    return c?.nomComplet || `Client #${customerId}`;
  }

  function getCustomer(customerId: string) {
    return customers.find((c: any) => c.id === customerId);
  }

  function getProjectName(projetId: string) {
    const p = projects.find((p: any) => p.id === projetId);
    return p?.title || `Projet #${projetId}`;
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '-';
    return new Date(Number(dateStr)).toLocaleDateString('fr-FR');
  }

  function calculTotaux() {
    const montantHT = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
    const montantTVA = Math.round(montantHT * (step1.tauxTVA / 100));
    return { montantHT, montantTVA, montantTTC: montantHT + montantTVA };
  }

  function getStatusActions(statut: string) {
    const actions = [];
    if (statut === 'BROUILLON') actions.push({ action: 'ENVOYER', label: 'Envoyer', icon: Send, color: 'text-[#185FA5]' });
    if (statut === 'ENVOYEE') actions.push({ action: 'PAYER', label: 'Payer', icon: Check, color: 'text-[#0F6E56]' });
    return actions;
  }

  function resolveDesignation(item: any): string {
    if (!item.designation?.startsWith('Service ref.')) return item.designation;
    const refId = item.designation.replace('Service ref. ', '').trim();
    const service = services.find((s: any) => s.id === refId);
    return service ? (serviceNames[service.nom] || service.nom) : item.designation;
  }

  const handleOpenModal = () => {
    setStep1(initialStep1); setLignes([]); setLignesError(''); setStep(1); setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); setStep(1); setStep1(initialStep1); setLignes([]); setLignesError('');
  };

  const handleProjetChange = (projetId: string) => {
    const projet = projects.find((p: any) => p.id === projetId);
    setStep1({ ...step1, projetId, customerId: projet?.customerId || '' });
    setLignesError('');
  };

  const handleNextStep = async () => {
    if (!step1.projetId || !step1.customerId || !step1.dateEcheance) return;
    const projet = projects.find((p: any) => p.id === step1.projetId);
    if (projet && projet.customerId !== step1.customerId) {
      const clientAttendu = projet.customer?.nomComplet || getCustomerName(projet.customerId);
      setLignesError(`Ce client n'est pas attaché à ce projet. Le client associé est : "${clientAttendu}".`);
      return;
    }
    setLoadingLignes(true); setLignesError('');
    try {
      const data: any = await request(API_URL, LIST_SERVICES_BY_PROJET, { projetId: step1.projetId });
      const svcs: any[] = data.listServicesByProjet || [];
      if (svcs.length === 0) {
        setLignesError("Ce projet n'a aucun service configuré. Ajoutez des services au projet avant de créer une facture.");
        setLoadingLignes(false); return;
      }
      setLignes(svcs.map((ps: any) => {
        const service = services.find((s: any) => s.id === ps.serviceId);
        return {
          id: ps.id, serviceId: ps.serviceId,
          designation: service ? (serviceNames[service.nom] || service.nom) : `Service ref. ${ps.serviceId}`,
          quantite: ps.quantite, prixUnitaire: ps.prixUnitaire,
          montantTotal: ps.quantite * ps.prixUnitaire,
        };
      }));
      setStep(2);
    } catch { setLignesError('Erreur lors du chargement des services du projet.'); }
    finally { setLoadingLignes(false); }
  };

  const handleLigneChange = (index: number, field: 'quantite' | 'prixUnitaire' | 'designation', value: string) => {
    setLignes(prev => prev.map((l, i) => {
      if (i !== index) return l;
      const updated = { ...l, [field]: field === 'designation' ? value : Math.max(1, parseInt(value) || 1) };
      updated.montantTotal = updated.quantite * updated.prixUnitaire;
      return updated;
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await request(API_URL, CREATE_INVOICE, {
        input: {
          projetId: step1.projetId, customerId: step1.customerId,
          dateEcheance: step1.dateEcheance, tauxTVA: Number(step1.tauxTVA),
          notes: step1.notes || null,
          reference: step1.reference || null,
          idClient: step1.idClient || null,
          description: step1.description || null,
        }
      });
      await fetchData(); handleCloseModal();
    } catch (error) { console.error('Erreur création facture:', error); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (invoice: any, action: string) => {
    setSaving(true);
    try {
      await request(API_URL, CHANGER_STATUT_INVOICE, { id: invoice.id, action });
      await fetchData();
    } catch (error) { console.error('Erreur changement statut:', error); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    setSaving(true);
    try {
      await request(API_URL, DELETE_INVOICE, { id: invoiceToDelete.id });
      await fetchData();
    } catch (error) { console.error('Erreur suppression:', error); }
    finally { setSaving(false); setInvoiceToDelete(null); setIsDeleteOpen(false); }
  };

  const handlePrint = async (invoice: any) => {
    setInvoiceToPrint(invoice); setLoadingPrint(true); setIsPrintModalOpen(true);
    try {
      const data: any = await request(API_URL, GET_INVOICE_DETAIL, { id: invoice.id });
      setPrintItems(data.getInvoice?.items || []);
      setInvoiceToPrint(data.getInvoice);
    } catch (error) { console.error('Erreur chargement détail:', error); }
    finally { setLoadingPrint(false); }
  };

  const handleExportPDF = async () => {
    if (!invoiceToPrint) return;
    setExportingPdf(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const element = document.getElementById('print-area');
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight > pageHeight ? pageHeight : imgHeight);
      pdf.save(`${invoiceToPrint.numero}.pdf`);
    } catch (error) { console.error('Erreur export PDF:', error); }
    finally { setExportingPdf(false); }
  };

  const handleExportExcel = async () => {
    if (!invoiceToPrint || printItems.length === 0) return;
    try {
      const XLSX = await import('xlsx');
      const client = getCustomer(invoiceToPrint.customerId);
      const infoData = [
        ['FACTURE', invoiceToPrint.numero],
        ['Référence', invoiceToPrint.reference || ''],
        ['ID Client', invoiceToPrint.idClient || ''],
        ['Description', invoiceToPrint.description || ''],
        ['Statut', statutLabels[invoiceToPrint.statut] || invoiceToPrint.statut],
        ['Date émission', formatDate(invoiceToPrint.dateEmission)],
        ['Date échéance', formatDate(invoiceToPrint.dateEcheance)],
        [],
        ['Émetteur', ENTREPRISE.nom],
        ['Adresse', ENTREPRISE.adresse],
        ['Tél', ENTREPRISE.telephone],
        ['Email', ENTREPRISE.email],
        ['', ENTREPRISE.rccm],
        ['', ENTREPRISE.niu],
        ['', ENTREPRISE.banque],
        [],
        ['Client', client?.nomComplet || invoiceToPrint.customerId],
        ['Entreprise', client?.entreprise || ''],
        ['Projet', getProjectName(invoiceToPrint.projetId)],
      ];
      const lignesData = [
        ['N°', 'Désignation', 'Unité', 'Quantité', 'Prix unit. (FCFA)', 'Total (FCFA)'],
        ...printItems.map((item: any, i: number) => [
          i + 1, resolveDesignation(item), 'Pièce',
          item.quantite, item.prixUnitaire, item.montantTotal,
        ]),
        [],
        ['', '', '', '', 'Montant HT', invoiceToPrint.montantHT],
        ['', '', '', '', `TVA (${invoiceToPrint.tauxTVA}%)`, invoiceToPrint.montantTVA],
        ['', '', '', '', 'Total TTC', invoiceToPrint.montantTTC],
      ];
      const wb = XLSX.utils.book_new();
      const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
      const wsLignes = XLSX.utils.aoa_to_sheet(lignesData);
      wsInfo['!cols'] = [{ wch: 20 }, { wch: 55 }];
      wsLignes['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 12 }, { wch: 10 }, { wch: 22 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, wsInfo, 'Informations');
      XLSX.utils.book_append_sheet(wb, wsLignes, 'Lignes');
      XLSX.writeFile(wb, `${invoiceToPrint.numero}.xlsx`);
    } catch (error) { console.error('Erreur export Excel:', error); }
  };

  const handleExportCSV = () => {
    if (!invoiceToPrint || printItems.length === 0) return;
    const client = getCustomer(invoiceToPrint.customerId);
    const rows = [
      ['Facture', invoiceToPrint.numero],
      ['Référence', invoiceToPrint.reference || ''],
      ['ID Client', invoiceToPrint.idClient || ''],
      ['Description', invoiceToPrint.description || ''],
      ['Statut', statutLabels[invoiceToPrint.statut] || invoiceToPrint.statut],
      ['Date émission', formatDate(invoiceToPrint.dateEmission)],
      ['Date échéance', formatDate(invoiceToPrint.dateEcheance)],
      ['Client', client?.nomComplet || invoiceToPrint.customerId],
      ['Projet', getProjectName(invoiceToPrint.projetId)],
      [],
      ['N°', 'Désignation', 'Unité', 'Quantité', 'Prix unitaire (FCFA)', 'Total (FCFA)'],
      ...printItems.map((item: any, i: number) => [
        i + 1, resolveDesignation(item), 'Pièce',
        item.quantite, item.prixUnitaire, item.montantTotal,
      ]),
      [],
      ['', '', '', '', 'Montant HT', invoiceToPrint.montantHT],
      ['', '', '', '', `TVA (${invoiceToPrint.tauxTVA}%)`, invoiceToPrint.montantTVA],
      ['', '', '', '', 'Total TTC', invoiceToPrint.montantTTC],
    ];
    const csvContent = rows
      .map(row => row.map((cell: any) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `${invoiceToPrint.numero}.csv`;
    link.click(); URL.revokeObjectURL(url);
  };

  const { montantHT, montantTVA, montantTTC } = calculTotaux();

  return (
    <AppLayout title="Factures">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed !important; top: 0; left: 0;
            width: 100%; height: 100%; background: white;
            z-index: 9999; padding: 24px 32px; box-sizing: border-box; font-size: 11px;
          }
        }
      `}</style>

      {/* Barre recherche */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888780]" />
          <input type="text" placeholder="Rechercher par numéro ou client..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5]" />
        </div>
        <Button onClick={handleOpenModal}><Plus className="w-4 h-4" />Nouvelle facture</Button>
      </div>

      {/* Liste */}
      <Panel title={`${filteredInvoices.length} facture${filteredInvoices.length !== 1 ? 's' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12"><LoadingSpinner /></div>
        ) : filteredInvoices.length === 0 ? (
          <EmptyState title="Aucune facture"
            description={searchTerm ? "Aucune facture ne correspond à votre recherche" : "Créez votre première facture"}
            action={!searchTerm && <Button onClick={handleOpenModal}><Plus className="w-4 h-4" />Nouvelle facture</Button>} />
        ) : (
          <div className="divide-y divide-[#E5E4E0]">
            {filteredInvoices.map((invoice: any) => {
              const actions = getStatusActions(invoice.statut);
              return (
                <div key={invoice.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F6F3] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-[#F7F6F3] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#5F5E5A]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1A1A1A]">{invoice.numero}</span>
                        {invoice.reference && <span className="text-xs text-[#888780]">• {invoice.reference}</span>}
                        <StatusPill status={invoice.statut} />
                      </div>
                      <div className="text-xs text-[#888780]">
                        {getCustomerName(invoice.customerId)} • {getProjectName(invoice.projetId)} • Échéance : {formatDate(invoice.dateEcheance)}
                      </div>
                      {invoice.description && (
                        <div className="text-xs text-[#5F5E5A] italic">{invoice.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#1A1A1A]">{invoice.montantTTC?.toLocaleString('fr-FR') || 0} FCFA</div>
                      <div className="text-xs text-[#888780]">HT : {invoice.montantHT?.toLocaleString('fr-FR') || 0} • TVA {invoice.tauxTVA}% : {invoice.montantTVA?.toLocaleString('fr-FR') || 0}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {actions.map((a) => (
                        <Button key={a.action} variant="secondary" size="sm" title={a.label}
                          onClick={() => handleStatusChange(invoice, a.action)}>
                          <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
                        </Button>
                      ))}
                      <Button variant="secondary" size="sm" title="Aperçu / Exporter" onClick={() => handlePrint(invoice)}>
                        <Printer className="w-3.5 h-3.5 text-[#5F5E5A]" />
                      </Button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="danger" size="sm" onClick={() => { setInvoiceToDelete(invoice); setIsDeleteOpen(true); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {/* ── Modal Aperçu / Export ── */}
      <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Aperçu de la facture" size="lg">
        {loadingPrint ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : invoiceToPrint && (
          <>
            <div id="print-area" className="bg-white text-[#1A1A1A] font-sans text-xs">

              {/* En-tête */}
              <div className="flex justify-between items-start pb-3 mb-4" style={{ borderBottom: '3px solid #1B2A6B' }}>
                <div className="flex items-center gap-3">
                  <AsTiellLogo />
                  <div className="max-w-xs">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#1B9AA0' }}>Ingénierie des TIC</div>
                    <div className="text-xs leading-tight text-[#5F5E5A]">{ENTREPRISE.activite}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tracking-widest" style={{ color: '#1B2A6B' }}>FACTURE</div>
                  <div className="mt-2 border border-dashed border-[#1B2A6B] rounded px-3 py-2 text-right">
                    <div className="text-xs font-bold" style={{ color: '#1B2A6B' }}>
                      N° : {invoiceToPrint.reference || invoiceToPrint.numero}
                    </div>
                    <div className="text-xs text-[#5F5E5A]">Date : {formatDate(invoiceToPrint.dateEmission)}</div>
                  </div>
                  <div className="mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: statutColors[invoiceToPrint.statut]?.bg, color: statutColors[invoiceToPrint.statut]?.color }}>
                    {statutLabels[invoiceToPrint.statut]}
                  </div>
                </div>
              </div>

              {/* Bloc client */}
              <div className="border border-dashed rounded p-3 mb-4" style={{ borderColor: '#1B9AA0' }}>
                {(() => {
                  const client = getCustomer(invoiceToPrint.customerId);
                  return (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="font-bold" style={{ color: '#1B9AA0' }}>CLIENT : </span>
                        <span className="font-bold text-[#1A1A1A]">{client?.nomComplet || invoiceToPrint.customerId}</span>
                        {client?.entreprise && <div className="text-[#5F5E5A]">{client.entreprise}</div>}
                        {client?.adresse && <div className="text-[#5F5E5A]">{client.adresse}</div>}
                      </div>
                      <div>
                        {invoiceToPrint.description && (
                          <>
                            <span className="font-bold" style={{ color: '#1B9AA0' }}>DESCRIPTION : </span>
                            <span className="text-[#5F5E5A] italic">{invoiceToPrint.description}</span>
                          </>
                        )}
                      </div>
                      <div>
                        {invoiceToPrint.idClient && (
                          <>
                            <span className="font-bold" style={{ color: '#1B9AA0' }}>ID Client : </span>
                            <span className="text-[#5F5E5A]">{invoiceToPrint.idClient}</span>
                          </>
                        )}
                        <div className="mt-1">
                          <span className="font-bold" style={{ color: '#1B9AA0' }}>Projet : </span>
                          <span className="text-[#5F5E5A]">{getProjectName(invoiceToPrint.projetId)}</span>
                        </div>
                        <div>
                          <span className="font-bold" style={{ color: '#1B9AA0' }}>Échéance : </span>
                          <span className="text-[#5F5E5A]">{formatDate(invoiceToPrint.dateEcheance)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Tableau lignes */}
              <table className="w-full mb-4" style={{ borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1B2A6B', color: 'white' }}>
                    <th className="text-center px-2 py-2 font-semibold" style={{ width: 30 }}>Num</th>
                    <th className="text-left px-3 py-2 font-semibold">Fourniture / Service</th>
                    <th className="text-center px-2 py-2 font-semibold" style={{ width: 80 }}>Unité</th>
                    <th className="text-center px-2 py-2 font-semibold" style={{ width: 60 }}>Qté</th>
                    <th className="text-right px-2 py-2 font-semibold" style={{ width: 100 }}>P U</th>
                    <th className="text-right px-2 py-2 font-semibold" style={{ width: 110 }}>P T</th>
                  </tr>
                </thead>
                <tbody>
                  {printItems.map((item: any, index: number) => (
                    <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#F0F4FF' }}>
                      <td className="text-center px-2 py-1.5 text-[#5F5E5A]" style={{ borderBottom: '1px solid #E5E4E0' }}>{index + 1}</td>
                      <td className="px-3 py-1.5 text-[#1A1A1A]" style={{ borderBottom: '1px solid #E5E4E0' }}>{resolveDesignation(item)}</td>
                      <td className="text-center px-2 py-1.5 text-[#5F5E5A]" style={{ borderBottom: '1px solid #E5E4E0' }}>Pièce</td>
                      <td className="text-center px-2 py-1.5 text-[#1A1A1A]" style={{ borderBottom: '1px solid #E5E4E0' }}>{item.quantite}</td>
                      <td className="text-right px-2 py-1.5 text-[#1A1A1A]" style={{ borderBottom: '1px solid #E5E4E0' }}>{item.prixUnitaire?.toLocaleString('fr-FR')},00</td>
                      <td className="text-right px-2 py-1.5 font-medium text-[#1A1A1A]" style={{ borderBottom: '1px solid #E5E4E0' }}>{item.montantTotal?.toLocaleString('fr-FR')},00</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totaux */}
              <div className="flex justify-end mb-4">
                <div style={{ width: 300 }}>
                  <div className="flex justify-between py-1.5 text-xs" style={{ borderTop: '1px solid #E5E4E0' }}>
                    <span className="font-semibold text-[#5F5E5A]">Total HT</span>
                    <span className="font-bold text-[#1A1A1A]">{invoiceToPrint.montantHT?.toLocaleString('fr-FR')},00</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-xs" style={{ borderTop: '1px solid #E5E4E0' }}>
                    <span className="text-[#5F5E5A]">TVA {invoiceToPrint.tauxTVA}%</span>
                    <span className="text-[#5F5E5A]">{invoiceToPrint.montantTVA > 0 ? `${invoiceToPrint.montantTVA?.toLocaleString('fr-FR')},00` : '/'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-xs" style={{ borderTop: '1px solid #E5E4E0' }}>
                    <span className="text-[#5F5E5A]">CA 5%</span>
                    <span className="text-[#5F5E5A]">/</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 text-sm font-bold text-white rounded-md mt-1"
                    style={{ backgroundColor: '#1B2A6B' }}>
                    <span>TOTAL TTC</span>
                    <span>{invoiceToPrint.montantTTC?.toLocaleString('fr-FR')},00</span>
                  </div>
                </div>
              </div>

              {/* Montant en lettres */}
              <div className="mb-4 px-3 py-2 rounded text-xs italic" style={{ border: '1px solid #1B9AA0', color: '#1B2A6B' }}>
                Arrêté la présente FACTURE en Hors Taxes à la somme de{' '}
                <strong>{montantEnLettres(invoiceToPrint.montantHT)}</strong>
              </div>

              {/* Notes */}
              {invoiceToPrint.notes && (
                <div className="rounded p-2 mb-4 text-xs" style={{ border: '1px solid #E5E4E0', backgroundColor: '#FAFAFA' }}>
                  <span className="font-bold text-[#888780]">Notes : </span>
                  <span className="text-[#5F5E5A]">{invoiceToPrint.notes}</span>
                </div>
              )}

              {/* Conditions + Signatures */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-dashed rounded p-3 text-xs" style={{ borderColor: '#1B2A6B' }}>
                  <div className="font-bold mb-1" style={{ color: '#1B9AA0' }}>**Conditions :</div>
                  <div className="text-[#5F5E5A] leading-relaxed">
                    <div className="italic">Devis valable 30 Jours</div>
                    <div>La réalisation des travaux est souscrite par :</div>
                    <div>- La validation du devis via un Bon de commande ;</div>
                    <div>- Le paiement peut se faire en espèce ou par virement bancaire à l'ordre de :</div>
                    <div className="font-bold mt-1" style={{ color: '#1B2A6B' }}>ASTIELL SERVICES</div>
                    <div>{ENTREPRISE.banque}</div>
                  </div>
                </div>
                <div className="text-xs">
                  <div className="text-right font-semibold mb-6 text-[#1A1A1A]">La Direction</div>
                  <div className="grid grid-cols-2 gap-2 mt-8">
                    <div className="border rounded p-2" style={{ borderColor: '#1B2A6B' }}>
                      <div className="font-bold text-center mb-1" style={{ color: '#1B2A6B' }}>FOURNISSEUR</div>
                      <div className="font-bold text-center text-xs" style={{ color: '#1B9AA0' }}>{ENTREPRISE.nom}</div>
                      <div className="text-[#5F5E5A] text-center" style={{ fontSize: 9 }}>{ENTREPRISE.adresse}</div>
                      <div className="text-[#5F5E5A] text-center" style={{ fontSize: 9 }}>{ENTREPRISE.email}</div>
                      <div className="text-[#5F5E5A] text-center" style={{ fontSize: 9 }}>Tel: {ENTREPRISE.telephone}</div>
                      <div className="mt-4 text-center text-[#888780]" style={{ fontSize: 9 }}>Signature</div>
                    </div>
                    <div className="border rounded p-2" style={{ borderColor: '#1B9AA0' }}>
                      <div className="font-bold text-center mb-1" style={{ color: '#1B9AA0' }}>CLIENT</div>
                      {(() => {
                        const client = getCustomer(invoiceToPrint.customerId);
                        return (
                          <>
                            <div className="font-bold text-center" style={{ color: '#1B2A6B', fontSize: 10 }}>{client?.nomComplet}</div>
                            {client?.entreprise && <div className="text-center text-[#5F5E5A]" style={{ fontSize: 9 }}>{client.entreprise}</div>}
                            {client?.adresse && <div className="text-center text-[#5F5E5A]" style={{ fontSize: 9 }}>{client.adresse}</div>}
                          </>
                        );
                      })()}
                      <div className="mt-4 text-center text-[#888780]" style={{ fontSize: 9 }}>Signature</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied de page */}
              <div className="text-center pt-2 leading-relaxed" style={{ borderTop: '2px solid #1B2A6B', fontSize: 9, color: '#888780' }}>
                <div>Tél : {ENTREPRISE.telephone} – {ENTREPRISE.email}</div>
                <div>{ENTREPRISE.banque} – {ENTREPRISE.rccm}</div>
                <div>{ENTREPRISE.scien} – {ENTREPRISE.niu}</div>
                <div>{ENTREPRISE.adresse}</div>
              </div>
            </div>

            {/* Boutons export */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E5E4E0]">
              <Button variant="secondary" onClick={() => setIsPrintModalOpen(false)}>Fermer</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleExportCSV} title="Exporter en CSV">
                  <FileText className="w-4 h-4 text-[#888780]" /><span className="text-xs">CSV</span>
                </Button>
                <Button variant="secondary" onClick={handleExportExcel} title="Exporter en Excel">
                  <FileSpreadsheet className="w-4 h-4 text-[#0F6E56]" /><span className="text-xs">Excel</span>
                </Button>
                <Button variant="secondary" onClick={handleExportPDF} disabled={exportingPdf} title="PDF">
                  {exportingPdf ? <LoadingSpinner size="sm" /> : <FileDown className="w-4 h-4 text-[#A32D2D]" />}
                  <span className="text-xs">PDF</span>
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />Imprimer
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* ── Modal création 2 étapes ── */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}
        title={step === 1 ? 'Nouvelle facture — Informations' : 'Nouvelle facture — Lignes de facturation'}
        size="lg">

        <div className="flex items-center gap-2 mb-6">
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${step === 1 ? 'bg-[#185FA5] text-white' : 'bg-[#E5E4E0] text-[#5F5E5A]'}`}>
            <span>1</span><span>Informations</span>
          </div>
          <div className="flex-1 h-px bg-[#E5E4E0]" />
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${step === 2 ? 'bg-[#185FA5] text-white' : 'bg-[#E5E4E0] text-[#5F5E5A]'}`}>
            <span>2</span><span>Lignes</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Projet" required>
                <Select value={step1.projetId} onChange={handleProjetChange}
                  options={projects.map((p: any) => ({ value: p.id, label: p.title }))}
                  placeholder="Sélectionner un projet" required />
              </FormField>
              <FormField label="Client" required>
                {step1.projetId ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F6F3] border border-[#D1D0CC] rounded-md text-sm text-[#1A1A1A]">
                    <span className="flex-1">{getCustomerName(step1.customerId)}</span>
                    <span className="text-xs text-[#888780] italic">Auto-sélectionné</span>
                  </div>
                ) : (
                  <Select value={step1.customerId}
                    onChange={(v) => { setStep1({ ...step1, customerId: v }); setLignesError(''); }}
                    options={customers.map((c: any) => ({ value: c.id, label: c.nomComplet }))}
                    placeholder="Sélectionner d'abord un projet" required />
                )}
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Référence" >
                <Input value={step1.reference}
                  onChange={(v) => setStep1({ ...step1, reference: v })}
                  placeholder="Ex: Fact_0100-2026/DG/Finances/BZV" />
              </FormField>
              <FormField label="ID Client">
                <Input value={step1.idClient}
                  onChange={(v) => setStep1({ ...step1, idClient: v })}
                  placeholder="Ex: ASS-OYO-124C2" />
              </FormField>
            </div>

            <FormField label="Description">
              <Input value={step1.description}
                onChange={(v) => setStep1({ ...step1, description: v })}
                placeholder="Ex: Fourniture des consommables de Bureaux_Avril_26" />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date d'échéance" required>
                <Input type="date" value={step1.dateEcheance}
                  onChange={(v) => setStep1({ ...step1, dateEcheance: v })} required />
              </FormField>
              <FormField label="Taux TVA (%)" required>
                <Input type="number" value={String(step1.tauxTVA)}
                  onChange={(v) => setStep1({ ...step1, tauxTVA: parseFloat(v) || 0 })}
                  min="0" max="100" step="0.5" required />
              </FormField>
            </div>

            <FormField label="Notes">
              <TextArea value={step1.notes} onChange={(v) => setStep1({ ...step1, notes: v })}
                rows={2} placeholder="Informations complémentaires..." />
            </FormField>

            {lignesError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />{lignesError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E4E0]">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>Annuler</Button>
              <Button type="button" onClick={handleNextStep}
                disabled={!step1.projetId || !step1.customerId || !step1.dateEcheance || loadingLignes}>
                {loadingLignes ? <LoadingSpinner size="sm" /> : <><span>Suivant</span><ArrowRight className="w-4 h-4" /></>}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-[#F7F6F3] rounded-md px-4 py-3 text-xs text-[#5F5E5A] flex flex-wrap gap-4">
              <span><strong>Projet :</strong> {getProjectName(step1.projetId)}</span>
              <span><strong>Client :</strong> {getCustomerName(step1.customerId)}</span>
              <span><strong>Échéance :</strong> {formatDate(step1.dateEcheance)}</span>
              <span><strong>TVA :</strong> {step1.tauxTVA}%</span>
              {step1.reference && <span><strong>Réf :</strong> {step1.reference}</span>}
              {step1.idClient && <span><strong>ID Client :</strong> {step1.idClient}</span>}
            </div>

            <div className="border border-[#E5E4E0] rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F6F3]">
                  <tr>
                    <th className="text-center px-2 py-2 text-xs font-medium text-[#5F5E5A] w-10">N°</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-[#5F5E5A]">Désignation</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-20">Qté</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-32">P U (FCFA)</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-32">P T (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E4E0]">
                  {lignes.map((ligne, index) => (
                    <tr key={ligne.id} className="hover:bg-[#F7F6F3]">
                      <td className="text-center px-2 py-2 text-xs text-[#888780]">{index + 1}</td>
                      <td className="px-3 py-2">
                        <input type="text" value={ligne.designation}
                          onChange={(e) => handleLigneChange(index, 'designation', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-[#D1D0CC] focus:border-[#185FA5] focus:outline-none text-sm text-[#1A1A1A] py-0.5" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={ligne.quantite} min="1"
                          onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-[#D1D0CC] focus:border-[#185FA5] focus:outline-none text-sm text-right text-[#1A1A1A] py-0.5" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" value={ligne.prixUnitaire} min="0"
                          onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-[#D1D0CC] focus:border-[#185FA5] focus:outline-none text-sm text-right text-[#1A1A1A] py-0.5" />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-[#1A1A1A]">
                        {(ligne.quantite * ligne.prixUnitaire).toLocaleString('fr-FR')},00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border border-[#E5E4E0] rounded-md overflow-hidden">
              <div className="flex justify-between px-4 py-2 text-sm text-[#5F5E5A]">
                <span>Total HT</span><span className="font-semibold">{montantHT.toLocaleString('fr-FR')},00 FCFA</span>
              </div>
              <div className="flex justify-between px-4 py-2 text-sm text-[#5F5E5A] border-t border-[#E5E4E0]">
                <span>TVA ({step1.tauxTVA}%)</span>
                <span>{montantTVA > 0 ? `${montantTVA.toLocaleString('fr-FR')},00 FCFA` : '/'}</span>
              </div>
              <div className="flex justify-between px-4 py-2 text-sm text-[#5F5E5A] border-t border-[#E5E4E0]">
                <span>CA 5%</span><span>/</span>
              </div>
              <div className="flex justify-between px-4 py-2 text-sm font-bold text-white border-t border-[#E5E4E0]"
                style={{ backgroundColor: '#1B2A6B' }}>
                <span>TOTAL TTC</span><span>{montantTTC.toLocaleString('fr-FR')},00 FCFA</span>
              </div>
            </div>

            <div className="px-3 py-2 rounded text-xs italic" style={{ border: '1px solid #1B9AA0', color: '#1B2A6B' }}>
              Arrêté en Hors Taxes à la somme de <strong>{montantEnLettres(montantHT)}</strong>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-[#E5E4E0]">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4" />Retour
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                <Button type="button" onClick={handleSubmit} disabled={saving}>
                  {saving ? <LoadingSpinner size="sm" /> : 'Créer la facture'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setInvoiceToDelete(null); }}
        onConfirm={handleDelete}
        title="Supprimer la facture"
        message={`Êtes-vous sûr de vouloir supprimer la facture "${invoiceToDelete?.numero}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </AppLayout>
  );
}