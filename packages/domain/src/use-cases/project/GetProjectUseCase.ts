import type { IProjectRepository } from '../../repositories/IProjectRepository';
import type { Project } from '../../entities/Project';
import type { Result } from '@astiell/shared';

export class GetProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Result<Project>> {
    return this.projectRepository.findById(id);
  }
}