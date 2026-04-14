import type { IServiceRepository } from '../../repositories/IServiceRepository';
import type { Service } from '../../entities/Service';
import type { PaginationInput, PaginatedResult } from '@astiell/shared';

export class ListServicesUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(pagination?: PaginationInput): Promise<PaginatedResult<Service>> {
    return this.serviceRepository.findAll(pagination);
  }
}