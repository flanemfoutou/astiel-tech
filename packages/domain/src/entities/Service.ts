import { generateId, type Id } from '@astiell/shared';

// ─── Categories ────────────────────────────────────────────────────────────

export const SERVICE_CATEGORIES = {
  TIC: 'TIC',
  GENIE_CIVIL: 'GENIE_CIVIL',
  LOGISTIQUE: 'LOGISTIQUE',
  COMMERCE: 'COMMERCE',
  FOURNITURE: 'FOURNITURE',
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;

// ─── Noms ──────────────────────────────────────────────────────────────────

export const SERVICE_NOMS = {
  DEVELOPPEMENT_APP_WEB_MOBILE:         'DEVELOPPEMENT_APP_WEB_MOBILE',
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: 'MAINTENANCE_INFORMATIQUE_BUREAUTIQUE',
  CONNEXION_INTERNET_RESEAUX:           'CONNEXION_INTERNET_RESEAUX',
  VIDEOSURVEILLANCE_CCTV:               'VIDEOSURVEILLANCE_CCTV',
  CONTROLE_ACCES:                       'CONTROLE_ACCES',
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: 'FOURNITURE_EQUIPEMENTS_INFORMATIQUES',
  FOURNITURE_CONSOMMABLES_TELECOM:      'FOURNITURE_CONSOMMABLES_TELECOM',
} as const;

export type ServiceNom = keyof typeof SERVICE_NOMS;

export const SERVICE_NOM_LABELS: Record<ServiceNom, string> = {
  DEVELOPPEMENT_APP_WEB_MOBILE:         'Développement applications web et mobiles',
  MAINTENANCE_INFORMATIQUE_BUREAUTIQUE: 'Maintenance informatique et bureautique',
  CONNEXION_INTERNET_RESEAUX:           'Connexion internet et réseaux',
  VIDEOSURVEILLANCE_CCTV:               'Vidéosurveillance (CCTV)',
  CONTROLE_ACCES:                       'Contrôle d\'accès',
  FOURNITURE_EQUIPEMENTS_INFORMATIQUES: 'Fourniture d\'équipements informatiques',
  FOURNITURE_CONSOMMABLES_TELECOM:      'Fourniture de consommables informatiques et télécommunication',
};

// ─── Statuts ───────────────────────────────────────────────────────────────

export const SERVICE_STATUSES = {
  ACTIF:   'ACTIF',
  INACTIF: 'INACTIF',
  BLOQUE:  'BLOQUE',
} as const;

export type ServiceStatus = keyof typeof SERVICE_STATUSES;

// ─── Props ─────────────────────────────────────────────────────────────────

export interface ServiceProps {
  id: Id;
  nom: ServiceNom;
  description: string;
  categorie: ServiceCategory;
  tarifJournalier?: number;
  statut: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServicePlain extends Omit<ServiceProps, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

// ─── Status transition guard ───────────────────────────────────────────────

const ALLOWED_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  ACTIF:   ['INACTIF', 'BLOQUE'],
  INACTIF: ['ACTIF'],
  BLOQUE:  ['ACTIF'],
};

function assertTransition(current: ServiceStatus, next: ServiceStatus): void {
  if (!ALLOWED_TRANSITIONS[current].includes(next)) {
    throw new Error(
      `Cannot transition service from "${current}" to "${next}". ` +
      `Allowed transitions: ACTIF → INACTIF, ACTIF → BLOQUE, INACTIF → ACTIF, BLOQUE → ACTIF.`
    );
  }
}

// ─── Entity ────────────────────────────────────────────────────────────────

export class Service {
  private constructor(private readonly props: ServiceProps) {}

  static create(
    input: Omit<ServiceProps, 'id' | 'createdAt' | 'updatedAt' | 'statut'>
  ): Service {
    const now = new Date();
    return new Service({
      ...input,
      id: generateId('ser'),
      statut: 'ACTIF',
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: Omit<ServiceProps, 'createdAt' | 'updatedAt'> & {
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
  }): Service {
    return new Service({
      ...props,
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    });
  }

  get id()              { return this.props.id; }
  get nom()             { return this.props.nom; }
  get description()     { return this.props.description; }
  get categorie()       { return this.props.categorie; }
  get tarifJournalier() { return this.props.tarifJournalier; }
  get statut()          { return this.props.statut; }
  get createdAt()       { return this.props.createdAt; }
  get updatedAt()       { return this.props.updatedAt; }

  mettreAJour(
    updates: Partial<Pick<ServiceProps, 'nom' | 'description' | 'categorie' | 'tarifJournalier'>>
  ): Service {
    return new Service({ ...this.props, ...updates, updatedAt: new Date() });
  }

  activer(): Service {
    assertTransition(this.props.statut, 'ACTIF');
    return new Service({ ...this.props, statut: 'ACTIF', updatedAt: new Date() });
  }

  desactiver(): Service {
    assertTransition(this.props.statut, 'INACTIF');
    return new Service({ ...this.props, statut: 'INACTIF', updatedAt: new Date() });
  }

  bloquer(): Service {
    assertTransition(this.props.statut, 'BLOQUE');
    return new Service({ ...this.props, statut: 'BLOQUE', updatedAt: new Date() });
  }

  toPlain(): ServicePlain {
    return {
      ...this.props,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}