import type { Project } from '../entities/Project';
import type { Result } from '@astiell/shared';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Result<Project>>;
  findByCustomerId(customerId: string): Promise<Project[]>;
  existsByCustomerAndTitle(customerId: string, title: string): Promise<boolean>;
  // ✅ Vérifie si un customerId existe réellement
  existsCustomer(customerId: string): Promise<boolean>;
  save(project: Project): Promise<Result<Project>>;
  delete(id: string): Promise<Result<void>>;
}