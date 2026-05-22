import { type Id } from '@astiell/shared';

export const INVOICE_STATUS = {
  BROUILLON: 'BROUILLON',
  ENVOYEE: 'ENVOYEE',
  PAYEE: 'PAYEE',
  ANNULEE: 'ANNULEE',
} as const;

export type InvoiceStatus = keyof typeof INVOICE_STATUS;

export interface InvoiceProps {
  id: Id;
  numero: string;
  reference?: string;
  idClient?: string;
  description?: string;
  projetId: string;
  customerId: string;
  statut: InvoiceStatus;
  dateEmission: Date;
  dateEcheance: Date;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Invoice {
  private constructor(private readonly props: InvoiceProps) {}

  static create(input: Omit<InvoiceProps, 'id' | 'numero' | 'montantTVA' | 'montantTTC' | 'createdAt' | 'updatedAt'>): Invoice {
    const now = new Date();
    const id = `inv-${crypto.randomUUID()}`;
    const numero = Invoice.genererNumero();
    const montantTVA = input.montantHT * (input.tauxTVA / 100);
    const montantTTC = input.montantHT + montantTVA;

    return new Invoice({
      ...input,
      id,
      numero,
      montantTVA,
      montantTTC,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  private static genererNumero(): string {
    const now = new Date();
    const annee = now.getFullYear();
    const mois = String(now.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ASTIELL-${annee}${mois}-${rand}`;
  }

  get id() { return this.props.id; }
  get numero() { return this.props.numero; }
  get reference() { return this.props.reference; }
  get idClient() { return this.props.idClient; }
  get description() { return this.props.description; }
  get projetId() { return this.props.projetId; }
  get customerId() { return this.props.customerId; }
  get statut() { return this.props.statut; }
  get dateEmission() { return this.props.dateEmission; }
  get dateEcheance() { return this.props.dateEcheance; }
  get montantHT() { return this.props.montantHT; }
  get tauxTVA() { return this.props.tauxTVA; }
  get montantTVA() { return this.props.montantTVA; }
  get montantTTC() { return this.props.montantTTC; }
  get notes() { return this.props.notes; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  marquerEnvoyee(): Invoice {
    if (this.props.statut !== 'BROUILLON') throw new Error('Seul un brouillon peut être envoyé');
    return new Invoice({ ...this.props, statut: 'ENVOYEE', updatedAt: new Date() });
  }

  marquerPayee(): Invoice {
    if (this.props.statut !== 'ENVOYEE') throw new Error('Seule une facture envoyée peut être marquée payée');
    return new Invoice({ ...this.props, statut: 'PAYEE', updatedAt: new Date() });
  }

  annuler(): Invoice {
    if (this.props.statut === 'PAYEE') throw new Error('Une facture payée ne peut pas être annulée');
    return new Invoice({ ...this.props, statut: 'ANNULEE', updatedAt: new Date() });
  }

  recalculer(montantHT: number): Invoice {
    const montantTVA = montantHT * (this.props.tauxTVA / 100);
    return new Invoice({
      ...this.props, montantHT, montantTVA,
      montantTTC: montantHT + montantTVA, updatedAt: new Date(),
    });
  }

  toPlain(): InvoiceProps {
    return { ...this.props };
  }
}