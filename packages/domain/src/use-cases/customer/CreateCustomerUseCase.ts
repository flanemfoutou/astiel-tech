import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { Customer } from '../../entities/Customer';
import { err, ValidationError, type Result } from '@astiell/shared';

export interface CreateCustomerInput {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise?: string;
  adresse?: string;
}

const REQUIRED_FIELDS: (keyof CreateCustomerInput)[] = ['nom', 'prenom', 'email', 'telephone'];

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(input: CreateCustomerInput): Promise<Result<Customer>> {
    try {
      // ── 1. Required fields validation (no DB call if missing) ──────────────
      const missingFields = REQUIRED_FIELDS.filter(
        field => !input[field] || String(input[field]).trim() === ''
      );

      if (missingFields.length > 0) {
        const fieldList = missingFields.join(', ');
        return err(
          new ValidationError(
            `The following required fields are missing or empty: ${fieldList}. Please fill in all required fields before submitting.`,
            missingFields[0]
          )
        );
      }

      // ── 2. Duplicate check ─────────────────────────────────────────────────
      const { exists, field } = await this.customerRepository.existsByEmailOrPhone(
        input.email.trim(),
        input.telephone.trim()
      );

      if (exists) {
        const message =
          field === 'email'
            ? `A customer with email "${input.email}" already exists in the database.`
            : `A customer with phone number "${input.telephone}" already exists in the database.`;

        return err(new ValidationError(message, field!));
      }

      // ── 3. Name duplicate check ────────────────────────────────────────────
      const nameExists = await this.customerRepository.existsByFullName(
        input.nom.trim(),
        input.prenom.trim()
      );

      if (nameExists) {
        return err(
          new ValidationError(
            `A customer named "${input.prenom} ${input.nom}" already exists in the database.`,
            'nom'
          )
        );
      }

      const customer = Customer.create(input);
      return await this.customerRepository.save(customer);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}