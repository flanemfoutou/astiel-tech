import type { IProjectServiceRepository } from '../../repositories/IProjectServiceRepository';
import { ProjectService } from '../../entities/ProjectService';
import { ok, err, type Result } from '@astiell/shared';

export interface AddServiceToProjectInput {
  projetId: string;
  serviceId: string;
  quantite: number;
  prixUnitaire: number;
}

export class AddServiceToProjectUseCase {
  constructor(private readonly projectServiceRepository: IProjectServiceRepository) {}

  async execute(input: AddServiceToProjectInput): Promise<Result<ProjectService>> {
    try {
      const projectService = ProjectService.create(input);
      return await this.projectServiceRepository.save(projectService);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}