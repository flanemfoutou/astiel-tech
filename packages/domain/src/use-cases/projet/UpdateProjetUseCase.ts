import type { IProjetRepository } from '../../repositories/IProjetRepository';
import { Projet } from '../../entities/Projet';
import { ok, err, type Result } from '@astiell/shared';
import type { ProjectStatus } from '../../value-objects/ProjectStatus';

interface UpdateProjetInput {
  id: string;
  titre?: string;
  description?: string;
  statut?: ProjectStatus;
  dateFin?: Date;
}

export class UpdateProjetUseCase {
  constructor(private readonly projetRepository: IProjetRepository) {}

  async execute(input: UpdateProjetInput): Promise<Result<Projet>> {
    try {
      const findResult = await this.projetRepository.findById(input.id);
      if (findResult.isErr()) {
        return findResult;
      }

      const existingProjet = findResult.value;

      // Create updated projet
      const updatedProjet = Projet.reconstitute({
        ...existingProjet,
        titre: input.titre ?? existingProjet.titre,
        description: input.description ?? existingProjet.description,
        statut: input.statut ?? existingProjet.statut,
        dateFin: input.dateFin ?? existingProjet.dateFin,
        updatedAt: new Date(),
      });

      return await this.projetRepository.save(updatedProjet);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}