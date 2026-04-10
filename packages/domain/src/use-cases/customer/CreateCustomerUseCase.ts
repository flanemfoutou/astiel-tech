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

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(input: CreateCustomerInput): Promise<Result<Customer>> {
    try {
      const { exists, field } = await this.customerRepository.existsByEmailOrPhone(
        input.email,
        input.telephone
      );

      if (exists) {
        const message =
          field === 'email'
            ? `Customer with email "${input.email}" already exists in the database`
            : `Customer with phone number "${input.telephone}" already exists in the database`;

        return err(new ValidationError(message, field!));
      }

      const customer = Customer.create(input);
      return await this.customerRepository.save(customer);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}