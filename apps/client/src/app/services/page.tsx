'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, StatusPill, Button, Modal, FormField, Input, TextArea, Select, LoadingSpinner, EmptyState, ConfirmDialog } from '@/components';
import { GET_SERVICES, CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from '@/queries/service';
import { Settings, Camera, Lock, Package, Wrench, Code, Wifi, Plus, Edit2, Trash2, Search } from 'lucide-react';

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

const initialFormState = {
  nom: '',
  description: '',
  categorie: 'DEVELOPPEMENT_APP_WEB_MOBILE',
  tarifJournalier: '',
  statut: 'ACTIF',
};

const categoryOptions = [
  { value: 'DEVELOPPEMENT_APP_WEB_MOBILE', label: 'Développement web & mobile' },
  { value: 'VIDEOSURVEILLANCE_CCTV', label: 'Vidéosurveillance (CCTV)' },
  { value: 'CONTROLE_ACCES', label: 'Contrôle d\'accès' },
  { value: 'CONNEXION_INTERNET_RESEAUX', label: 'Connexion internet & réseaux' },
  { value: 'FOURNITURE_EQUIPEMENTS_INFORMATIQUES', label: 'Équipements informatiques' },
  { value: 'MAINTENANCE_INFORMATIQUE_BUREAUTIQUE', label: 'Maintenance informatique' },
];

const statusOptions = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'INACTIF', label: 'Inactif' },
  { value: 'BLOQUE', label: 'Bloqué' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await request(API_URL, GET_SERVICES, { pagination: { page: 1, limit: 100 } });
      setServices(data.listServices?.items || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((s: any) => 
    serviceNames[s.nom]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nom: service.nom || '',
        description: service.description || '',
        categorie: service.categorie || 'DEVELOPPEMENT_APP_WEB_MOBILE',
        tarifJournalier: service.tarifJournalier?.toString() || '',
        statut: service.statut || 'ACTIF',
      });
    } else {
      setEditingService(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const input = {
        ...formData,
        tarifJournalier: parseInt(formData.tarifJournalier) || 0,
      };
      if (editingService) {
        await request(API_URL, UPDATE_SERVICE, { id: editingService.id, input });
      } else {
        await request(API_URL, CREATE_SERVICE, { input });
      }
      await fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setSaving(true);
    try {
      await request(API_URL, DELETE_SERVICE, { id: serviceToDelete.id });
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setSaving(false);
      setServiceToDelete(null);
    }
  };

  return (
    <AppLayout title="Services">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888780]" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          />
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Nouveau service
        </Button>
      </div>

      <Panel title={`${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredServices.length === 0 ? (
          <EmptyState 
            title="Aucun service" 
            description={searchTerm ? "Aucun service ne correspond à votre recherche" : "Commencez par ajouter votre premier service"}
            action={!searchTerm && <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4" />Ajouter un service</Button>}
          />
        ) : (
          <div className="divide-y divide-[#E5E4E0]">
            {filteredServices.map((service: any) => {
              const iconConfig = serviceIcons[service.nom] || { icon: Settings, bg: 'bg-gray-100', color: 'text-gray-600' };
              const Icon = iconConfig.icon;
              return (
                <div key={service.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F6F3] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${iconConfig.bg}`}>
                      <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1A1A1A]">{serviceNames[service.nom] || service.nom}</span>
                      </div>
                      <div className="text-xs text-[#888780]">{service.categorie} • {service.tarifJournalier?.toLocaleString()} FCFA/jour</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusPill status={service.statut} />
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenModal(service)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => { setServiceToDelete(service); setIsDeleteOpen(true); }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingService ? 'Modifier le service' : 'Nouveau service'} size="lg">
        <form onSubmit={handleSubmit}>
          <FormField label="Nom du service" required>
            <Select 
              value={formData.nom} 
              onChange={(v) => setFormData({...formData, nom: v})} 
              options={categoryOptions}
              required
            />
          </FormField>
          <FormField label="Description">
            <TextArea 
              value={formData.description} 
              onChange={(v) => setFormData({...formData, description: v})} 
              rows={3}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Catégorie" required>
              <Select 
                value={formData.categorie} 
                onChange={(v) => setFormData({...formData, categorie: v})} 
                options={categoryOptions}
                required
              />
            </FormField>
            <FormField label="Tarif journalier (FCFA)" required>
              <Input 
                type="number"
                value={formData.tarifJournalier} 
                onChange={(v) => setFormData({...formData, tarifJournalier: v})} 
                required
              />
            </FormField>
          </div>
          <FormField label="Statut" required>
            <Select 
              value={formData.statut} 
              onChange={(v) => setFormData({...formData, statut: v})} 
              options={statusOptions}
              required
            />
          </FormField>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E5E4E0]">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <LoadingSpinner size="sm" /> : editingService ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le service"
        message={`Êtes-vous sûr de vouloir supprimer ${serviceToDelete ? serviceNames[serviceToDelete.nom] || serviceToDelete.nom : ''} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </AppLayout>
  );
}
