import type { IServiceRepository } from '../../repositories/IServiceRepository';
import type { Service, ServiceCategory, ServiceNom } from '../../entities/Service';
import { SERVICE_CATEGORIES, SERVICE_NOMS } from '../../entities/Service';
import { err, type Result } from '@astiell/shared';

export interface UpdateServiceInput {
  id: string;
  nom?: ServiceNom;
  description?: string;
  categorie?: ServiceCategory;
  tarifJournalier?: number;
}

function validateUpdateInput(input: UpdateServiceInput): void {
  const errors: string[] = [];

  if (input.nom !== undefined && !(input.nom in SERVICE_NOMS)) {
    errors.push(
      `"nom" has an invalid value "${input.nom}". ` +
      `Accepted values: ${Object.keys(SERVICE_NOMS).join(', ')}.`
    );
  }

  if (input.description !== undefined && !input.description?.trim()) {
    errors.push('"description" cannot be set to an empty value.');
  }

  if (input.categorie !== undefined && !(input.categorie in SERVICE_CATEGORIES)) {
    errors.push(
      `"categorie" has an invalid value "${input.categorie}". ` +
      `Accepted values: ${Object.keys(SERVICE_CATEGORIES).join(', ')}.`
    );
  }

  if (input.tarifJournalier !== undefined && input.tarifJournalier !== null) {
    if (typeof input.tarifJournalier !== 'number' || input.tarifJournalier < 0) {
      errors.push('"tarifJournalier" must be a positive number.');
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `The following fields have invalid values:\n` +
      errors.map(e => `  • ${e}`).join('\n')
    );
  }
}

export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: UpdateServiceInput): Promise<Result<Service>> {
    try {
      if (!input.id?.trim()) {
        return err(new Error('"id" is required to update a service. Please provide a valid ID.'));
      }

      validateUpdateInput(input);

      const findResult = await this.serviceRepository.findById(input.id.trim());
      if (!findResult.success) {
        return err(
          new Error(`No service found with ID "${input.id}". Please verify the ID and try again.`)
        );
      }

      const { id, ...updates } = input;
      const serviceMisAJour = findResult.value.mettreAJour(updates);
      return await this.serviceRepository.save(serviceMisAJour);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error while updating service.'));
    }
  }
}