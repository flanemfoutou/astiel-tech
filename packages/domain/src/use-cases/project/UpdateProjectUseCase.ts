import type { IProjectRepository } from '../../repositories/IProjectRepository';
import { Project } from '../../entities/Project';
import { err, type Result } from '@astiell/shared';
import type { ProjectStatus } from '../../value-objects/ProjectStatus';

export interface UpdateProjectInput {
  id: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  endDate?: Date;
}

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Result<Project>> {
    try {
      const findResult = await this.projectRepository.findById(input.id);
      if (!findResult.success) return findResult;

      const existing = findResult.value;

      const updated = Project.reconstitute({
        ...existing.toPlain(),
        title: input.title ?? existing.title,
        description: input.description ?? existing.description,
        status: input.status ?? existing.status,
        endDate: input.endDate ?? existing.endDate,
        updatedAt: new Date(),
      });

      return await this.projectRepository.save(updated);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}