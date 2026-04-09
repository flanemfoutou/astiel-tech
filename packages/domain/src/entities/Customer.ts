import { generateId, type Id } from '@astiell/shared';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';

export interface CustomerProps {
  id: Id;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise?: string;
  adresse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer {
  private constructor(private readonly props: CustomerProps) {}

  static create(
    input: Omit<CustomerProps, 'id' | 'createdAt' | 'updatedAt'>
  ): Customer {
    Email.create(input.email);
    PhoneNumber.create(input.telephone);

    const now = new Date();
    return new Customer({
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  get id() { return this.props.id; }
  get nom() { return this.props.nom; }
  get prenom() { return this.props.prenom; }
  get email() { return this.props.email; }
  get telephone() { return this.props.telephone; }
  get entreprise() { return this.props.entreprise; }
  get adresse() { return this.props.adresse; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  get nomComplet(): string {
    return `${this.props.prenom} ${this.props.nom}`;
  }

  mettreAJour(updates: Partial<Pick<CustomerProps, 'nom' | 'prenom' | 'entreprise' | 'adresse'>>): Customer {
    return new Customer({
      ...this.props,
      ...updates,
      updatedAt: new Date(),
    });
  }

  toPlain(): CustomerProps {
    return { ...this.props };
  }
}