import type { IServiceRepository } from '../../repositories/IServiceRepository';
import type { Service } from '../../entities/Service';
import type { Result } from '@astiell/shared';

export class GetServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<Result<Service>> {
    return this.serviceRepository.findById(id);
  }
}