import type { IServiceRepository } from '../../repositories/IServiceRepository';
import type { Service } from '../../entities/Service';
import { err, type Result } from '@astiell/shared';

export class GetServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<Result<Service>> {
    // ✅ Guard 1: ID must be provided before touching the database
    if (!id?.trim()) {
      return err(
        new Error('A service ID is required. Please provide a valid ID.')
      );
    }

    const result = await this.serviceRepository.findById(id.trim());

    // ✅ Guard 2: ID provided but not found in the database
    if (!result.success) {
      return err(
        new Error(
          `No service found with ID "${id}". ` +
          `Please verify the ID and try again.`
        )
      );
    }

    return result;
  }
}