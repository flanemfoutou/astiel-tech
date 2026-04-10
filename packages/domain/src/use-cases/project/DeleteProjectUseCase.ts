import type { IProjectRepository } from '../../repositories/IProjectRepository';
import { err, type Result } from '@astiell/shared';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      return await this.projectRepository.delete(id);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}