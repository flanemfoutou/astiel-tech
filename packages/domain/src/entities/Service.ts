import { generateId, type Id } from '@astiell/shared';

export const SERVICE_CATEGORIES = {
  TIC: 'TIC',
  GENIE_CIVIL: 'GENIE_CIVIL',
  LOGISTIQUE: 'LOGISTIQUE',
  COMMERCE: 'COMMERCE',
  FOURNITURE: 'FOURNITURE',
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;

// ✅ Statut du service
export const SERVICE_STATUSES = {
  ACTIF: 'ACTIF',
  INACTIF: 'INACTIF',
  BLOQUE: 'BLOQUE',
} as const;

export type ServiceStatus = keyof typeof SERVICE_STATUSES;

export interface ServiceProps {
  id: Id;
  nom: string;
  description: string;
  categorie: ServiceCategory;
  tarifJournalier?: number;
  statut: ServiceStatus; // ✅ remplace actif boolean
  createdAt: Date;
  updatedAt: Date;
}

export class Service {
  private constructor(private readonly props: ServiceProps) {}

  static create(input: Omit<ServiceProps, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const now = new Date();
    return new Service({
      ...input,
      id: generateId('ser'),
      statut: input.statut ?? 'ACTIF', // ✅ ACTIF par défaut
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ServiceProps): Service {
    return new Service(props);
  }

  get id() { return this.props.id; }
  get nom() { return this.props.nom; }
  get description() { return this.props.description; }
  get categorie() { return this.props.categorie; }
  get tarifJournalier() { return this.props.tarifJournalier; }
  get statut() { return this.props.statut; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  mettreAJour(
    updates: Partial<Pick<ServiceProps, 'nom' | 'description' | 'categorie' | 'tarifJournalier'>>
  ): Service {
    return new Service({ ...this.props, ...updates, updatedAt: new Date() });
  }

  // ✅ Transitions de statut
  activer(): Service {
    return new Service({ ...this.props, statut: 'ACTIF', updatedAt: new Date() });
  }

  desactiver(): Service {
    return new Service({ ...this.props, statut: 'INACTIF', updatedAt: new Date() });
  }

  bloquer(): Service {
    return new Service({ ...this.props, statut: 'BLOQUE', updatedAt: new Date() });
  }

  toPlain(): ServiceProps {
    return { ...this.props };
  }
}