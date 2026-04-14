import type { IServiceRepository } from '../../repositories/IServiceRepository';
import type { Service, ServiceCategory } from '../../entities/Service';
import { err, NotFoundError, type Result } from '@astiell/shared';

export interface UpdateServiceInput {
  id: string;
  nom?: string;
  description?: string;
  categorie?: ServiceCategory;
  tarifJournalier?: number;
}

export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(input: UpdateServiceInput): Promise<Result<Service>> {
    try {
      const findResult = await this.serviceRepository.findById(input.id);
      if (!findResult.success) return err(new NotFoundError('Service', input.id));

      const { id, ...updates } = input;
      const serviceMisAJour = findResult.value.mettreAJour(updates);
      return await this.serviceRepository.save(serviceMisAJour);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}