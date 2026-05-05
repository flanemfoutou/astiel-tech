// src/app/factures/page.tsx

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
import { Plus, Trash2, Search, FileText, Send, Check, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const initialStep1 = {
  projetId: '',
  customerId: '',
  dateEcheance: '',
  tauxTVA: 18,
  notes: '',
};

type LignePreview = {
  id: string;
  serviceId: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
};

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal état
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState(initialStep1);
  const [lignes, setLignes] = useState<LignePreview[]>([]);
  const [loadingLignes, setLoadingLignes] = useState(false);
  const [lignesError, setLignesError] = useState('');

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // ─── Fetch data ───────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [invoicesData, projectsData, customersData] = await Promise.all([
        request(API_URL, GET_INVOICES, { pagination: { page: 1, limit: 100 } }),
        request(API_URL, GET_PROJECTS),
        request(API_URL, GET_CUSTOMERS, { pagination: { page: 1, limit: 100 } }),
      ]);
      setInvoices((invoicesData as any).listInvoices?.items || []);
      setProjects((projectsData as any).listProjects || []);
      setCustomers((customersData as any).listCustomers?.items || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ─── Filtrage ─────────────────────────────────────────────
  const filteredInvoices = invoices.filter((i: any) =>
    i.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(i.customerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Helpers ──────────────────────────────────────────────
  function getCustomerName(customerId: string) {
    const c = customers.find((c: any) => c.id === customerId);
    return c?.nomComplet || `Client #${customerId}`;
  }

  function getProjectName(projetId: string) {
    const p = projects.find((p: any) => p.id === projetId);
    return p?.title || `Projet #${projetId}`;
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }

  function calculTotaux() {
    const montantHT = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
    const montantTVA = Math.round(montantHT * (step1.tauxTVA / 100));
    const montantTTC = montantHT + montantTVA;
    return { montantHT, montantTVA, montantTTC };
  }

  function getStatusActions(statut: string) {
    const actions = [];
    if (statut === 'BROUILLON') {
      actions.push({ action: 'ENVOYER', label: 'Envoyer', icon: Send, color: 'text-[#185FA5]' });
    }
    if (statut === 'ENVOYEE') {
      actions.push({ action: 'PAYER', label: 'Payer', icon: Check, color: 'text-[#0F6E56]' });
    }
    return actions;
  }

  // ─── Modal ────────────────────────────────────────────────
  const handleOpenModal = () => {
    setStep1(initialStep1);
    setLignes([]);
    setLignesError('');
    setStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setStep1(initialStep1);
    setLignes([]);
    setLignesError('');
  };

  // Passage étape 1 → 2 : on charge les ProjectServices du projet
  const handleNextStep = async () => {
    if (!step1.projetId || !step1.customerId || !step1.dateEcheance) return;
    setLoadingLignes(true);
    setLignesError('');
    try {
      const data: any = await request(API_URL, LIST_SERVICES_BY_PROJET, { projetId: step1.projetId });
      const services: any[] = data.listServicesByProjet || [];

      if (services.length === 0) {
        setLignesError('Ce projet n\'a aucun service configuré. Ajoutez des services au projet avant de créer une facture.');
        setLoadingLignes(false);
        return;
      }

      setLignes(services.map((ps: any) => ({
        id: ps.id,
        serviceId: ps.serviceId,
        designation: `Service ref. ${ps.serviceId}`,
        quantite: ps.quantite,
        prixUnitaire: ps.prixUnitaire,
        montantTotal: ps.quantite * ps.prixUnitaire,
      })));
      setStep(2);
    } catch (error) {
      setLignesError('Erreur lors du chargement des services du projet.');
    } finally {
      setLoadingLignes(false);
    }
  };

  // Modification d'une ligne
  const handleLigneChange = (index: number, field: 'quantite' | 'prixUnitaire' | 'designation', value: string) => {
    setLignes(prev => prev.map((l, i) => {
      if (i !== index) return l;
      const updated = { ...l, [field]: field === 'designation' ? value : Math.max(1, parseInt(value) || 1) };
      updated.montantTotal = updated.quantite * updated.prixUnitaire;
      return updated;
    }));
  };

  // ─── Soumission finale ────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const input = {
        projetId: step1.projetId,
        customerId: step1.customerId,
        dateEcheance: step1.dateEcheance,
        tauxTVA: Number(step1.tauxTVA),
        notes: step1.notes || null,
      };
      await request(API_URL, CREATE_INVOICE, { input });
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur création facture:', error);
    } finally {
      setSaving(false);
    }
  };

  // ─── Statut ───────────────────────────────────────────────
  const handleStatusChange = async (invoice: any, action: string) => {
    setSaving(true);
    try {
      await request(API_URL, CHANGER_STATUT_INVOICE, { id: invoice.id, action });
      await fetchData();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    } finally {
      setSaving(false);
    }
  };

  // ─── Suppression ─────────────────────────────────────────
  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    setSaving(true);
    try {
      await request(API_URL, DELETE_INVOICE, { id: invoiceToDelete.id });
      await fetchData();
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setSaving(false);
      setInvoiceToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  const { montantHT, montantTVA, montantTTC } = calculTotaux();

  // ─── Render ───────────────────────────────────────────────
  return (
    <AppLayout title="Factures">

      {/* Barre de recherche + bouton */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888780]" />
          <input
            type="text"
            placeholder="Rechercher par numéro ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          />
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </Button>
      </div>

      {/* Liste */}
      <Panel title={`${filteredInvoices.length} facture${filteredInvoices.length !== 1 ? 's' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12"><LoadingSpinner /></div>
        ) : filteredInvoices.length === 0 ? (
          <EmptyState
            title="Aucune facture"
            description={searchTerm ? "Aucune facture ne correspond à votre recherche" : "Créez votre première facture"}
            action={!searchTerm && (
              <Button onClick={handleOpenModal}><Plus className="w-4 h-4" />Nouvelle facture</Button>
            )}
          />
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
                        <StatusPill status={invoice.statut} />
                      </div>
                      <div className="text-xs text-[#888780]">
                        {getCustomerName(invoice.customerId)} • {getProjectName(invoice.projetId)} • Échéance: {formatDate(invoice.dateEcheance)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#1A1A1A]">
                        {invoice.montantTTC?.toLocaleString('fr-FR') || 0} FCFA
                      </div>
                      <div className="text-xs text-[#888780]">
                        HT: {invoice.montantHT?.toLocaleString('fr-FR') || 0} • TVA {invoice.tauxTVA}%: {invoice.montantTVA?.toLocaleString('fr-FR') || 0}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {actions.map((a) => (
                        <Button key={a.action} variant="secondary" size="sm" title={a.label}
                          onClick={() => handleStatusChange(invoice, a.action)}>
                          <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
                        </Button>
                      ))}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="danger" size="sm"
                          onClick={() => { setInvoiceToDelete(invoice); setIsDeleteOpen(true); }}>
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

      {/* ── Modal création en 2 étapes ── */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}
        title={step === 1 ? 'Nouvelle facture — Informations' : 'Nouvelle facture — Lignes de facturation'}
        size="lg">

        {/* Indicateur d'étapes */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${step === 1 ? 'bg-[#185FA5] text-white' : 'bg-[#E5E4E0] text-[#5F5E5A]'}`}>
            <span>1</span><span>Informations</span>
          </div>
          <div className="flex-1 h-px bg-[#E5E4E0]" />
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${step === 2 ? 'bg-[#185FA5] text-white' : 'bg-[#E5E4E0] text-[#5F5E5A]'}`}>
            <span>2</span><span>Lignes</span>
          </div>
        </div>

        {/* ── Étape 1 ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Projet" required>
                <Select
                  value={step1.projetId}
                  onChange={(v) => setStep1({ ...step1, projetId: v })}
                  options={projects.map((p: any) => ({ value: p.id, label: p.title }))}
                  placeholder="Sélectionner un projet"
                  required
                />
              </FormField>
              <FormField label="Client" required>
                <Select
                  value={step1.customerId}
                  onChange={(v) => setStep1({ ...step1, customerId: v })}
                  options={customers.map((c: any) => ({ value: c.id, label: c.nomComplet }))}
                  placeholder="Sélectionner un client"
                  required
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date d'échéance" required>
                <Input
                  type="date"
                  value={step1.dateEcheance}
                  onChange={(v) => setStep1({ ...step1, dateEcheance: v })}
                  required
                />
              </FormField>
              <FormField label="Taux TVA (%)" required>
                <Input
                  type="number"
                  value={String(step1.tauxTVA)}
                  onChange={(v) => setStep1({ ...step1, tauxTVA: parseFloat(v) || 0 })}
                  min="0" max="100" step="0.5"
                  required
                />
              </FormField>
            </div>
            <FormField label="Notes">
              <TextArea
                value={step1.notes}
                onChange={(v) => setStep1({ ...step1, notes: v })}
                rows={3}
                placeholder="Informations complémentaires..."
              />
            </FormField>

            {lignesError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {lignesError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E4E0]">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>Annuler</Button>
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!step1.projetId || !step1.customerId || !step1.dateEcheance || loadingLignes}
              >
                {loadingLignes ? <LoadingSpinner size="sm" /> : <><span>Suivant</span><ArrowRight className="w-4 h-4" /></>}
              </Button>
            </div>
          </div>
        )}

        {/* ── Étape 2 ── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Récap étape 1 */}
            <div className="bg-[#F7F6F3] rounded-md px-4 py-3 text-xs text-[#5F5E5A] flex flex-wrap gap-4">
              <span><strong>Projet :</strong> {getProjectName(step1.projetId)}</span>
              <span><strong>Client :</strong> {getCustomerName(step1.customerId)}</span>
              <span><strong>Échéance :</strong> {formatDate(step1.dateEcheance)}</span>
              <span><strong>TVA :</strong> {step1.tauxTVA}%</span>
            </div>

            {/* Tableau des lignes */}
            <div className="border border-[#E5E4E0] rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F6F3]">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-medium text-[#5F5E5A]">Désignation</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-24">Qté</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-32">Prix unit. (FCFA)</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-32">Total (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E4E0]">
                  {lignes.map((ligne, index) => (
                    <tr key={ligne.id} className="hover:bg-[#F7F6F3]">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={ligne.designation}
                          onChange={(e) => handleLigneChange(index, 'designation', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-[#D1D0CC] focus:border-[#185FA5] focus:outline-none text-sm text-[#1A1A1A] py-0.5"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={ligne.quantite}
                          min="1"
                          onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-[#D1D0CC] focus:border-[#185FA5] focus:outline-none text-sm text-right text-[#1A1A1A] py-0.5"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={ligne.prixUnitaire}
                          min="0"
                          onChange={(e) => handleLigneChange(index, 'prixUnitaire', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-[#D1D0CC] focus:border-[#185FA5] focus:outline-none text-sm text-right text-[#1A1A1A] py-0.5"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-[#1A1A1A]">
                        {(ligne.quantite * ligne.prixUnitaire).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="border border-[#E5E4E0] rounded-md overflow-hidden">
              <div className="flex justify-between px-4 py-2 text-sm text-[#5F5E5A]">
                <span>Montant HT</span>
                <span>{montantHT.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between px-4 py-2 text-sm text-[#5F5E5A] border-t border-[#E5E4E0]">
                <span>TVA ({step1.tauxTVA}%)</span>
                <span>{montantTVA.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between px-4 py-2 text-sm font-semibold text-[#1A1A1A] bg-[#F7F6F3] border-t border-[#E5E4E0]">
                <span>Total TTC</span>
                <span>{montantTTC.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <p className="text-xs text-[#888780]">
              💡 Les montants définitifs sont recalculés par le serveur. Vous pouvez ajuster les lignes ci-dessus pour prévisualisation.
            </p>

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

      {/* Confirm suppression */}
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