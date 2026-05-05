'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { AppLayout, Panel, StatusPill, Button, Modal, FormField, Input, TextArea, Select, LoadingSpinner, EmptyState, ConfirmDialog } from '@/components';
import { GET_PROJECTS } from '@/queries/project';
import { CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '@/queries/project';
import { GET_CUSTOMERS as GET_CUSTOMERS_Q } from '@/queries/customer';
import { GET_SERVICES } from '@/queries/service';
import { LIST_SERVICES_BY_PROJET, ADD_SERVICE_TO_PROJET, REMOVE_SERVICE_FROM_PROJET } from '@/queries/projectService';
import { Plus, Edit2, Trash2, Search, Calendar, User, Wrench, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const initialFormState = {
  title: '',
  description: '',
  customerId: '',
  status: 'EN_ATTENTE',
  startDate: '',
  endDate: '',
};

const statusOptions = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINE', label: 'Terminé' },
];

const serviceNames: Record<string, string> = {
  DEVELOPPEMENT_APP_WEB_MOBILE: 'Développement web & mobile',
  VIDEOSURVEILLANCE_CCTV: 'Vidéosurveillance (CCTV)',
  CONTROLE_ACCES: 'Contrôle d\'accès',
  CONNEXION_INTERNET_RESEAUX: 'Connexion internet & réseaux',
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: 'Équipements informatiques',
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: 'Maintenance informatique',
};

export default function ProjetsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal projet
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  // Modal services
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectServices, setProjectServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [newService, setNewService] = useState({ serviceId: '', quantite: '1', prixUnitaire: '' });
  const [addingService, setAddingService] = useState(false);

  const fetchData = async () => {
    try {
      const [projectsData, customersData, servicesData] = await Promise.all([
        request(API_URL, GET_PROJECTS),
        request(API_URL, GET_CUSTOMERS_Q, { pagination: { page: 1, limit: 100 } }),
        request(API_URL, GET_SERVICES, { pagination: { page: 1, limit: 100 } }),
      ]);
      setProjects(projectsData.listProjects || []);
      setCustomers(customersData.listCustomers?.items || []);
      setServices(servicesData.listServices?.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredProjects = projects.filter((p: any) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer?.nomComplet?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Projet CRUD ──────────────────────────────────────────
  const handleOpenModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        customerId: project.customerId || '',
        status: project.status || 'EN_ATTENTE',
        startDate: project.startDate?.split('T')[0] || '',
        endDate: project.endDate?.split('T')[0] || '',
      });
    } else {
      setEditingProject(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const input = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };
      if (editingProject) {
        await request(API_URL, UPDATE_PROJECT, { id: editingProject.id, input });
      } else {
        await request(API_URL, CREATE_PROJECT, { input });
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setSaving(true);
    try {
      await request(API_URL, DELETE_PROJECT, { id: projectToDelete.id });
      await fetchData();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setSaving(false);
      setProjectToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  // ── Services du projet ───────────────────────────────────
  const handleOpenServicesModal = async (project: any) => {
    setSelectedProject(project);
    setIsServicesModalOpen(true);
    setLoadingServices(true);
    setNewService({ serviceId: '', quantite: '1', prixUnitaire: '' });
    try {
      const data: any = await request(API_URL, LIST_SERVICES_BY_PROJET, { projetId: project.id });
      setProjectServices(data.listServicesByProjet || []);
    } catch (error) {
      console.error('Error fetching project services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.serviceId || !newService.prixUnitaire) return;
    setAddingService(true);
    try {
      await request(API_URL, ADD_SERVICE_TO_PROJET, {
        input: {
          projetId: selectedProject.id,
          serviceId: newService.serviceId,
          quantite: parseInt(newService.quantite) || 1,
          prixUnitaire: parseFloat(newService.prixUnitaire) || 0,
        },
      });
      const data: any = await request(API_URL, LIST_SERVICES_BY_PROJET, { projetId: selectedProject.id });
      setProjectServices(data.listServicesByProjet || []);
      setNewService({ serviceId: '', quantite: '1', prixUnitaire: '' });
    } catch (error) {
      console.error('Error adding service:', error);
    } finally {
      setAddingService(false);
    }
  };

  const handleRemoveService = async (psId: string) => {
    try {
      await request(API_URL, REMOVE_SERVICE_FROM_PROJET, { id: psId });
      setProjectServices((prev) => prev.filter((ps) => ps.id !== psId));
    } catch (error) {
      console.error('Error removing service:', error);
    }
  };

  const getProgressWidth = (status: string) => {
    if (status === 'TERMINE') return '100%';
    if (status === 'EN_COURS') return '50%';
    return '0%';
  };

  const getProgressColor = (status: string) => {
    if (status === 'TERMINE') return '#639922';
    if (status === 'EN_ATTENTE') return '#EF9F27';
    return '#378ADD';
  };

  const getServiceName = (serviceId: string) => {
    const s = services.find((s: any) => s.id === serviceId);
    return s ? (serviceNames[s.nom] || s.nom) : `Service #${serviceId}`;
  };

  return (
    <AppLayout title="Projets">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888780]" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-[#D1D0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          />
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Button>
      </div>

      <Panel title={`${filteredProjects.length} projet${filteredProjects.length !== 1 ? 's' : ''}`}>
        {loading ? (
          <div className="flex items-center justify-center py-12"><LoadingSpinner /></div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="Aucun projet"
            description={searchTerm ? "Aucun projet ne correspond à votre recherche" : "Commencez par créer votre premier projet"}
            action={!searchTerm && <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4" />Ajouter un projet</Button>}
          />
        ) : (
          <div className="divide-y divide-[#E5E4E0]">
            {filteredProjects.map((project: any) => (
              <div key={project.id} className="px-4 py-3 hover:bg-[#F7F6F3] transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1A1A1A]">{project.title}</span>
                      <StatusPill status={project.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-[#888780]">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{project.customer?.nomComplet || `Client #${project.customerId}`}</span>
                      {project.startDate && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(project.startDate).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-xs text-[#5F5E5A] mt-1 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                    {/* ← Bouton Services */}
                    <Button variant="secondary" size="sm" onClick={() => handleOpenServicesModal(project)} title="Gérer les services">
                      <Wrench className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleOpenModal(project)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => { setProjectToDelete(project); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="h-1 rounded-full bg-[#E5E4E0] mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: getProgressWidth(project.status), backgroundColor: getProgressColor(project.status) }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* ── Modal Projet ── */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProject ? 'Modifier le projet' : 'Nouveau projet'} size="lg">
        <form onSubmit={handleSubmit}>
          <FormField label="Titre" required>
            <Input value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
          </FormField>
          <FormField label="Description">
            <TextArea value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} rows={3} />
          </FormField>
          <FormField label="Client" required>
            <Select
              value={formData.customerId}
              onChange={(v) => setFormData({ ...formData, customerId: v })}
              options={customers.map((c: any) => ({ value: c.id, label: c.nomComplet }))}
              placeholder="Sélectionner un client"
              required
            />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Statut" required>
              <Select value={formData.status} onChange={(v) => setFormData({ ...formData, status: v })} options={statusOptions} required />
            </FormField>
            <FormField label="Date de début">
              <Input type="date" value={formData.startDate} onChange={(v) => setFormData({ ...formData, startDate: v })} />
            </FormField>
            <FormField label="Date de fin">
              <Input type="date" value={formData.endDate} onChange={(v) => setFormData({ ...formData, endDate: v })} />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E5E4E0]">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <LoadingSpinner size="sm" /> : editingProject ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Modal Services du projet ── */}
      <Modal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        title={`Services — ${selectedProject?.title}`}
        size="lg"
      >
        <div className="space-y-4">

          {/* Liste des services existants */}
          {loadingServices ? (
            <div className="flex justify-center py-6"><LoadingSpinner /></div>
          ) : projectServices.length === 0 ? (
            <div className="text-center py-6 text-sm text-[#888780]">Aucun service lié à ce projet</div>
          ) : (
            <div className="border border-[#E5E4E0] rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F6F3]">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-medium text-[#5F5E5A]">Service</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-16">Qté</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-32">Prix unit.</th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-[#5F5E5A] w-32">Total</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E4E0]">
                  {projectServices.map((ps: any) => (
                    <tr key={ps.id} className="hover:bg-[#F7F6F3]">
                      <td className="px-3 py-2 text-[#1A1A1A]">{getServiceName(ps.serviceId)}</td>
                      <td className="px-3 py-2 text-right text-[#1A1A1A]">{ps.quantite}</td>
                      <td className="px-3 py-2 text-right text-[#1A1A1A]">{ps.prixUnitaire?.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-3 py-2 text-right font-medium text-[#1A1A1A]">{ps.montantTotal?.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => handleRemoveService(ps.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formulaire ajout service */}
          <div className="border border-[#E5E4E0] rounded-md p-4 bg-[#F7F6F3] space-y-3">
            <p className="text-xs font-medium text-[#5F5E5A]">Ajouter un service</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <Select
                  value={newService.serviceId}
                  onChange={(v) => setNewService({ ...newService, serviceId: v })}
                  options={services.map((s: any) => ({ value: s.id, label: serviceNames[s.nom] || s.nom }))}
                  placeholder="Choisir un service"
                />
              </div>
              <div>
                <Input
                  type="number"
                  value={newService.quantite}
                  onChange={(v) => setNewService({ ...newService, quantite: v })}
                  placeholder="Quantité"
                  min="1"
                />
              </div>
              <div>
                <Input
                  type="number"
                  value={newService.prixUnitaire}
                  onChange={(v) => setNewService({ ...newService, prixUnitaire: v })}
                  placeholder="Prix unitaire (FCFA)"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleAddService}
                disabled={addingService || !newService.serviceId || !newService.prixUnitaire}
              >
                {addingService ? <LoadingSpinner size="sm" /> : <><Plus className="w-4 h-4" />Ajouter</>}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E5E4E0]">
            <Button variant="secondary" onClick={() => setIsServicesModalOpen(false)}>Fermer</Button>
          </div>
        </div>
      </Modal>

      {/* ── Confirm suppression projet ── */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le projet"
        message={`Êtes-vous sûr de vouloir supprimer le projet "${projectToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </AppLayout>
  );
}