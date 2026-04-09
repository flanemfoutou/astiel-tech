import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { Customer } from '../../entities/Customer';
import { ok, err, ValidationError, type Result } from '@astiell/shared';

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
      const emailExists = await this.customerRepository.existsByEmail(input.email);
      if (emailExists) {
        return err(new ValidationError(`Un customer avec l'email "${input.email}" existe déjà`, 'email'));
      }

      const customer = Customer.create(input);
      return await this.customerRepository.save(customer);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}