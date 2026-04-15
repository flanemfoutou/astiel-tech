import { type Id } from '@astiell/shared';

export interface InvoiceItemProps {
  id: Id;
  invoiceId: string;
  projectServiceId: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export class InvoiceItem {
  private constructor(private readonly props: InvoiceItemProps) {}

  static create(input: Omit<InvoiceItemProps, 'id' | 'montantTotal' | 'createdAt' | 'updatedAt'>): InvoiceItem {
    const now = new Date();
    const id = `item-${crypto.randomUUID()}`;
    const montantTotal = input.quantite * input.prixUnitaire;

    return new InvoiceItem({ ...input, id, montantTotal, createdAt: now, updatedAt: now });
  }

  static reconstitute(props: InvoiceItemProps): InvoiceItem {
    return new InvoiceItem(props);
  }

  get id() { return this.props.id; }
  get invoiceId() { return this.props.invoiceId; }
  get projectServiceId() { return this.props.projectServiceId; }
  get designation() { return this.props.designation; }
  get quantite() { return this.props.quantite; }
  get prixUnitaire() { return this.props.prixUnitaire; }
  get montantTotal() { return this.props.montantTotal; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  toPlain(): InvoiceItemProps {
    return { ...this.props };
  }
}