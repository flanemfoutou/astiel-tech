import type { IProjetRepository } from '../../repositories/IProjetRepository';
import type { Projet } from '../../entities/Projet';
import { ok, err, type Result } from '@astiell/shared';

export class CloturerProjetUseCase {
  constructor(private readonly projetRepository: IProjetRepository) {}

  async execute(id: string): Promise<Result<Projet>> {
    try {
      const findResult = await this.projetRepository.findById(id);
      if (!findResult.success) return findResult;

      const projetCloture = findResult.value.cloturer();
      return await this.projetRepository.save(projetCloture);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}