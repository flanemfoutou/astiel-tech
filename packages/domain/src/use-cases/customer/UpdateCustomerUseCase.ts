import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import type { Customer } from '../../entities/Customer';
import { err, NotFoundError, type Result } from '@astiell/shared';

export interface UpdateCustomerInput {
  id: string;
  nom?: string;
  prenom?: string;
  entreprise?: string;
  adresse?: string;
}

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(input: UpdateCustomerInput): Promise<Result<Customer>> {
    try {
      const findResult = await this.customerRepository.findById(input.id);
      if (!findResult.success) {
        return err(new NotFoundError('Customer', input.id));
      }

      const { id, ...updates } = input;
      const customerMisAJour = findResult.value.mettreAJour(updates);
      return await this.customerRepository.save(customerMisAJour);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}