import type { IProjectRepository } from '../../repositories/IProjectRepository';
import { Project } from '../../entities/Project';
import { err, ValidationError, type Result } from '@astiell/shared';
import type { ProjectStatus } from '../../value-objects/ProjectStatus';

export interface CreateProjectInput {
  title: string;
  description: string;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  status?: ProjectStatus;
}

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Result<Project>> {
    try {
      // ✅ Vérifie si ce customer est déjà attaché à un project avec le même titre
      const exists = await this.projectRepository.existsByCustomerAndTitle(
        input.customerId,
        input.title
      );

      if (exists) {
        return err(
          new ValidationError(
            `Customer "${input.customerId}" is already attached to a project titled "${input.title}"`,
            'customerId'
          )
        );
      }

      const project = Project.create({
        ...input,
        status: input.status ?? 'EN_ATTENTE',
      });

      return await this.projectRepository.save(project);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}