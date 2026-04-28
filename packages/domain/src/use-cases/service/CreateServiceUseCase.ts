import type { IServiceRepository } from '../../repositories/IServiceRepository';
import { Service, type ServiceCategory, type ServiceNom, SERVICE_CATEGORIES, SERVICE_NOMS } from '../../entities/Service';
import { err, type Result } from '@astiell/shared';

export interface CreateServiceInput {
  nom: ServiceNom;
  description: string;
  categorie: ServiceCategory;
  tarifJournalier?: number;
}

// ─── Noms dont la catégorie est forcée à FOURNITURE ───────────────────────

const FOURNITURE_NOMS: ServiceNom[] = [
  'FOURNITURE_EQUIPEMENTS_INFORMATIQUES',
  'FOURNITURE_CONSOMMABLES_TELECOM',
];

/**
 * Infers the correct category based on the service name:
 * - Names starting with FOURNITURE → forced to FOURNITURE
 * - All other names → forced to TIC
 *
 * If the provided category does not match the expected one,
 * an error is thrown explaining the rule.
 */
function inferCategorie(nom: ServiceNom, categorie: ServiceCategory): ServiceCategory {
  const expected: ServiceCategory = FOURNITURE_NOMS.includes(nom) ? 'FOURNITURE' : 'TIC';

  if (categorie !== expected) {
    throw new Error(
      `The service "${nom}" must belong to the "${expected}" category, not "${categorie}". ` +
      `Please update the category to "${expected}".`
    );
  }

  return expected;
}

// ─── Use Case ──────────────────────────────────────────────────────────────

export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: CreateServiceInput): Promise<Result<Service>> {
    try {
      // ── Validation ──────────────────────────────────────────────────────
      const errors: string[] = [];

      if (!input.nom) {
        errors.push(
          `"nom" is required. Accepted values: ${Object.keys(SERVICE_NOMS).join(', ')}.`
        );
      } else if (!(input.nom in SERVICE_NOMS)) {
        errors.push(
          `"nom" has an invalid value "${input.nom}". ` +
          `Accepted values: ${Object.keys(SERVICE_NOMS).join(', ')}.`
        );
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

      // ── Category rule ────────────────────────────────────────────────────
      // FOURNITURE_* names → must be FOURNITURE
      // All other names    → must be TIC
      const categorie = inferCategorie(input.nom, input.categorie);

      // ── Duplicate check ──────────────────────────────────────────────────
      const existing = await this.serviceRepository.findByNomAndCategorie(input.nom, categorie);
      if (existing) {
        return err(
          new Error(
            `A service "${input.nom}" already exists in the "${categorie}" category.`
          )
        );
      }

      // ── Creation ─────────────────────────────────────────────────────────
      const service = Service.create({
        nom: input.nom,
        description: input.description.trim(),
        categorie,
        tarifJournalier: input.tarifJournalier,
      });

      return await this.serviceRepository.save(service);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error while creating service.'));
    }
  }
}