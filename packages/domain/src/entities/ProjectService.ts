import { type Id } from '@astiell/shared';

export interface ProjectServiceProps {
  id: Id;
  projetId: string;
  serviceId: string;
  quantite: number;
  prixUnitaire: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectService {
  private constructor(private readonly props: ProjectServiceProps) {}

  static create(input: Omit<ProjectServiceProps, 'id' | 'createdAt' | 'updatedAt'>): ProjectService {
    const now = new Date();
    const id = `ps-${crypto.randomUUID()}`;
    return new ProjectService({ ...input, id, createdAt: now, updatedAt: now });
  }

  static reconstitute(props: ProjectServiceProps): ProjectService {
    return new ProjectService(props);
  }

  get id() { return this.props.id; }
  get projetId() { return this.props.projetId; }
  get serviceId() { return this.props.serviceId; }
  get quantite() { return this.props.quantite; }
  get prixUnitaire() { return this.props.prixUnitaire; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  get montantTotal(): number {
    return this.props.quantite * this.props.prixUnitaire;
  }

  mettreAJour(updates: Partial<Pick<ProjectServiceProps, 'quantite' | 'prixUnitaire'>>): ProjectService {
    return new ProjectService({ ...this.props, ...updates, updatedAt: new Date() });
  }

  toPlain(): ProjectServiceProps {
    return { ...this.props };
  }
}