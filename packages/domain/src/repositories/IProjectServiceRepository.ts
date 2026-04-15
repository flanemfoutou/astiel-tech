import type { ProjectService } from '../entities/ProjectService';
import type { Result } from '@astiell/shared';

export interface IProjectServiceRepository {
  findById(id: string): Promise<Result<ProjectService>>;
  findByProjetId(projetId: string): Promise<ProjectService[]>;
  findByServiceId(serviceId: string): Promise<ProjectService[]>;
  save(projectService: ProjectService): Promise<Result<ProjectService>>;
  delete(id: string): Promise<Result<void>>;
}