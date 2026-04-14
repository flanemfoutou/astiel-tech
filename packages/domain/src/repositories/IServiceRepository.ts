import type { Service, ServiceCategory } from '../entities/Service';
import type { Result, PaginationInput, PaginatedResult } from '@astiell/shared';

export interface IServiceRepository {
  findById(id: string): Promise<Result<Service>>;
  findByCategorie(categorie: ServiceCategory): Promise<Service[]>;
  findActifs(): Promise<Service[]>;
  findAll(pagination?: PaginationInput): Promise<PaginatedResult<Service>>;
  save(service: Service): Promise<Result<Service>>;
  delete(id: string): Promise<Result<void>>;
}