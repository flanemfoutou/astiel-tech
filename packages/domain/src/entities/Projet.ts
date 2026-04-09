import type { ProjectStatus } from '../value-objects/ProjectStatus';

export interface ProjetProps {
  id: string;
  titre: string;
  description: string;
  statut: ProjectStatus;
  clientId: string;
  dateDebut: Date;
  dateFin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Projet {
  private constructor(private readonly props: ProjetProps) {}

  static create(props: Omit<ProjetProps, 'id' | 'createdAt' | 'updatedAt'>): Projet {
    const now = new Date();
    return new Projet({
      ...props,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: ProjetProps): Projet {
    return new Projet(props);
  }

  get id() { return this.props.id; }
  get titre() { return this.props.titre; }
  get description() { return this.props.description; }
  get statut() { return this.props.statut; }
  get clientId() { return this.props.clientId; }
  get dateDebut() { return this.props.dateDebut; }
  get dateFin() { return this.props.dateFin; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  cloturer(): Projet {
    return new Projet({
      ...this.props,
      statut: 'TERMINE',
      dateFin: new Date(),
      updatedAt: new Date(),
    });
  }

  toPlain(): ProjetProps {
    return { ...this.props };
  }
}