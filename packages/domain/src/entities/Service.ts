import { generateId, type Id } from '@astiell/shared';

export const SERVICE_CATEGORIES = {
  TIC: 'TIC',
  GENIE_CIVIL: 'GENIE_CIVIL',
  LOGISTIQUE: 'LOGISTIQUE',
  COMMERCE: 'COMMERCE',
  FOURNITURE: 'FOURNITURE',
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;

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
  statut: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Domain error for illegal status transitions ───────────────────────────

export class InvalidStatusTransitionError extends Error {
  constructor(from: ServiceStatus, to: ServiceStatus) {
    super(
      `Cannot transition service from "${from}" to "${to}". ` +
      `Allowed transitions: ACTIF → INACTIF, ACTIF → BLOQUE, INACTIF → ACTIF, BLOQUE → ACTIF.`
    );
    this.name = 'InvalidStatusTransitionError';
  }
}

// ─── Allowed transitions ───────────────────────────────────────────────────

const ALLOWED_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  ACTIF:   ['INACTIF', 'BLOQUE'],
  INACTIF: ['ACTIF'],
  BLOQUE:  ['ACTIF'],
};

function assertTransition(current: ServiceStatus, next: ServiceStatus): void {
  if (!ALLOWED_TRANSITIONS[current].includes(next)) {
    throw new InvalidStatusTransitionError(current, next);
  }
}

// ─── Entity ────────────────────────────────────────────────────────────────

export class Service {
  private constructor(private readonly props: ServiceProps) {}

  static create(
    // statut is intentionally excluded — always starts as ACTIF
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

  static reconstitute(props: ServiceProps): Service {
    return new Service(props);
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

  /** Allowed from: INACTIF, BLOQUE */
  activer(): Service {
    assertTransition(this.props.statut, 'ACTIF');
    return new Service({ ...this.props, statut: 'ACTIF', updatedAt: new Date() });
  }

  /** Allowed from: ACTIF only */
  desactiver(): Service {
    assertTransition(this.props.statut, 'INACTIF');
    return new Service({ ...this.props, statut: 'INACTIF', updatedAt: new Date() });
  }

  /** Allowed from: ACTIF only */
  bloquer(): Service {
    assertTransition(this.props.statut, 'BLOQUE');
    return new Service({ ...this.props, statut: 'BLOQUE', updatedAt: new Date() });
  }

  toPlain(): ServiceProps {
    return { ...this.props };
  }
}