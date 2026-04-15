import type { IProjectRepository } from '../../repositories/IProjectRepository';
import type { Project } from '../../entities/Project';
import type { PaginationInput, PaginatedResult } from '@astiell/shared';

export class ListProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(pagination?: PaginationInput): Promise<PaginatedResult<Project>> {
    return this.projectRepository.findAll(pagination);
  }
}