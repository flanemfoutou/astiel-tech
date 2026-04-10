import type { IProjectRepository } from '../../repositories/IProjectRepository';
import type { Project } from '../../entities/Project';
import { err, type Result } from '@astiell/shared';

export class CloturerProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Result<Project>> {
    try {
      const findResult = await this.projectRepository.findById(id);
      if (!findResult.success) return findResult;

      const closed = findResult.value.close();
      return await this.projectRepository.save(closed);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error'));
    }
  }
}