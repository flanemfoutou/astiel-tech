'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, Button, Modal, FormField, Input, TextArea, LoadingSpinner, EmptyState, ConfirmDialog } from '@/components';
import { GET_CUSTOMERS, CREATE_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER } from '@/queries/customer';
import { Mail, Phone, Plus, Edit2, Trash2, Search } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const initialFormState = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  entreprise: '',
  adresse: '',
};

export default function ClientsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await request(API_URL, GET_CUSTOMERS, { pagination: { page: 1, limit: 100 } });
      setCustomers(data.listCustomers?.items || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c: any) => 
    c.nomComplet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.entreprise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (customer?: any) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        nom: customer.nom || '',
        prenom: customer.prenom || '',
        email: customer.email || '',
        telephone: customer.telephone || '',
        entreprise: customer.entreprise || '',
        adresse: customer.adresse || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCustomer) {
        await request(API_URL, UPDATE_CUSTOMER, { id: editingCustomer.id, input: formData });
      } else {
        await request(API_URL, CREATE_CUSTOMER, { input: formData });
      }
      await fetchCustomers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    setSaving(true);
    try {
      await request(API_URL, DELETE_CUSTOMER, { id: customerToDelete.id });
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setSaving(false);
      setCustomerToDelete(null);
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-[#E6F1FB] text-[#185FA5]', 'bg-[#E1F5EE] text-[#0F6E56]', 'bg-[#EEEDFE] text-[#534AB7]', 'bg-[#FAECE7] text-[#993C1D]'];
    return colors[index % colors.length];
  };

  const getInitials = (nom: string, prenom: string) => `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();

  return (
    <AppLayout title="Clients">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888780]" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          />
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Nouveau client
        </Button>
      </div>

      <Panel title={`${filteredCustomers.length} client${filteredCustomers.length !== 1 ? 's' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <EmptyState 
            title="Aucun client" 
            description={searchTerm ? "Aucun client ne correspond à votre recherche" : "Commencez par ajouter votre premier client"}
            action={!searchTerm && <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4" />Ajouter un client</Button>}
          />
        ) : (
          <div className="divide-y divide-[#E5E4E0]">
            {filteredCustomers.map((customer: any, index: number) => (
              <div key={customer.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[#F7F6F3] transition-colors group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getAvatarColor(index)}`}>
                  {getInitials(customer.nom, customer.prenom)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1A1A1A]">{customer.nomComplet}</span>
                    {customer.entreprise && <span className="text-xs text-[#888780]">• {customer.entreprise}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#5F5E5A]">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.telephone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(customer)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { setCustomerToDelete(customer); setIsDeleteOpen(true); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCustomer ? 'Modifier le client' : 'Nouveau client'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nom" required>
              <Input value={formData.nom} onChange={(v) => setFormData({...formData, nom: v})} required />
            </FormField>
            <FormField label="Prénom" required>
              <Input value={formData.prenom} onChange={(v) => setFormData({...formData, prenom: v})} required />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" required>
              <Input type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} required />
            </FormField>
            <FormField label="Téléphone" required>
              <Input type="tel" value={formData.telephone} onChange={(v) => setFormData({...formData, telephone: v})} required />
            </FormField>
          </div>
          <FormField label="Entreprise">
            <Input value={formData.entreprise} onChange={(v) => setFormData({...formData, entreprise: v})} />
          </FormField>
          <FormField label="Adresse">
            <TextArea value={formData.adresse} onChange={(v) => setFormData({...formData, adresse: v})} rows={2} />
          </FormField>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E5E4E0]">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <LoadingSpinner size="sm" /> : editingCustomer ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le client"
        message={`Êtes-vous sûr de vouloir supprimer ${customerToDelete?.nomComplet} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </AppLayout>
  );
}
