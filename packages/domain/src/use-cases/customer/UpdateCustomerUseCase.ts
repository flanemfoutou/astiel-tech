import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import type { Customer } from '../../entities/Customer';
import { err, NotFoundError, ValidationError, type Result } from '@astiell/shared';

export interface UpdateCustomerInput {
  id: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  entreprise?: string;
  adresse?: string;
}

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(input: UpdateCustomerInput): Promise<Result<Customer>> {
    try {
      // 1. Vérifie que le customer existe
      const findResult = await this.customerRepository.findById(input.id);
      if (!findResult.success) {
        return err(new NotFoundError('Customer', input.id));
      }

      const existing = findResult.value;

      // 2. Vérifie doublon email + téléphone sur un autre customer
      const { exists, field } = await this.customerRepository.existsByEmailOrPhone(
        input.email ?? existing.email,
        input.telephone ?? existing.telephone,
        input.id  // ✅ exclut le customer actuel
      );

      if (exists) {
        const message =
          field === 'email'
            ? `Another customer with email "${input.email ?? existing.email}" already exists in the database`
            : `Another customer with phone number "${input.telephone ?? existing.telephone}" already exists in the database`;

        return err(new ValidationError(message, field!));
      }

      // 3. Vérifie doublon nom + prénom sur un autre customer
      const nameExists = await this.customerRepository.existsByFullName(
        input.nom ?? existing.nom,
        input.prenom ?? existing.prenom,
        input.id  // ✅ exclut le customer actuel
      );

      if (nameExists) {
        return err(
          new ValidationError(
            `Another customer named "${input.prenom ?? existing.prenom} ${input.nom ?? existing.nom}" already exists in the database`,
            'nom'
          )
        );
      }

      // 4. Applique les modifications
      const { id, ...updates } = input;
      const updated = existing.mettreAJour(updates);
      return await this.customerRepository.save(updated);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}