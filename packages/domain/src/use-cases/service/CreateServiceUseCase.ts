import type { IServiceRepository } from '../../repositories/IServiceRepository';
import { Service, type ServiceCategory, SERVICE_CATEGORIES } from '../../entities/Service';
import { err, type Result } from '@astiell/shared';

export interface CreateServiceInput {
  nom: string;
  description: string;
  categorie: ServiceCategory;
  tarifJournalier?: number;
}

export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: CreateServiceInput): Promise<Result<Service>> {
    try {
      // ── Validation ──────────────────────────────────────────────────────
      const errors: string[] = [];

      if (!input.nom?.trim()) {
        errors.push('"nom" is required and cannot be empty.');
      }
      if (!input.description?.trim()) {
        errors.push('"description" is required and cannot be empty.');
      }
      if (!input.categorie) {
        errors.push(
          `"categorie" is required. Accepted values: ${Object.keys(SERVICE_CATEGORIES).join(', ')}.`
        );
      } else if (!(input.categorie in SERVICE_CATEGORIES)) {
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
        return err(
          new Error(
            `The following required fields are missing or invalid:\n` +
            errors.map(e => `  • ${e}`).join('\n')
          )
        );
      }

      // ── Duplicate check: same nom + same categorie = not allowed ────────
      const existing = await this.serviceRepository.findByNomAndCategorie(
        input.nom.trim(),
        input.categorie
      );
      if (existing) {
        return err(
          new Error(
            `A service named "${input.nom.trim()}" already exists in the "${input.categorie}" category. ` +
            `You can create it under a different category.`
          )
        );
      }

      // ── Creation ────────────────────────────────────────────────────────
      const service = Service.create({
        nom: input.nom.trim(),
        description: input.description.trim(),
        categorie: input.categorie,
        tarifJournalier: input.tarifJournalier,
      });

      return await this.serviceRepository.save(service);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error while creating service.'));
    }
  }
}