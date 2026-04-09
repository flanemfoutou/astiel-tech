import { generateId, type Id } from '@astiell/shared';

export const SERVICE_CATEGORIES = {
  TIC: 'TIC',
  GENIE_CIVIL: 'GENIE_CIVIL',
  LOGISTIQUE: 'LOGISTIQUE',
  COMMERCE: 'COMMERCE',
  FOURNITURE: 'FOURNITURE',
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;

export interface ServiceProps {
  id: Id;
  nom: string;
  description: string;
  categorie: ServiceCategory;
  tarifJournalier?: number;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Service {
  private constructor(private readonly props: ServiceProps) {}

  static create(input: Omit<ServiceProps, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const now = new Date();
    return new Service({
      ...input,
      id: generateId(),
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
  get actif() { return this.props.actif; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  desactiver(): Service {
    return new Service({ ...this.props, actif: false, updatedAt: new Date() });
  }

  toPlain(): ServiceProps {
    return { ...this.props };
  }
}