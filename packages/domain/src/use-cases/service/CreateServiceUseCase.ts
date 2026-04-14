import type { IServiceRepository } from '../../repositories/IServiceRepository';
import { Service, type ServiceCategory } from '../../entities/Service';
import { ok, err, type Result } from '@astiell/shared';

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
      const service = Service.create({ ...input, actif: true });
      return await this.serviceRepository.save(service);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}