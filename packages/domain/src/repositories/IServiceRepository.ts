import type { Service, ServiceCategory } from '../entities/Service';
import type { Result } from '@astiell/shared';

export interface IServiceRepository {
  findById(id: string): Promise<Result<Service>>;
  findByCategorie(categorie: ServiceCategory): Promise<Service[]>;
  findActifs(): Promise<Service[]>;
  save(service: Service): Promise<Result<Service>>;
}