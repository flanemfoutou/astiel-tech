import type { IProjetRepository } from '../../repositories/IProjetRepository';
import type { Projet } from '../../entities/Projet';
import type { Result } from '@astiell/shared';

export class GetProjetUseCase {
  constructor(private readonly projetRepository: IProjetRepository) {}

  async execute(id: string): Promise<Result<Projet>> {
    return this.projetRepository.findById(id);
  }
}