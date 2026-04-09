import type { IProjetRepository } from '../../repositories/IProjetRepository';
import { Projet } from '../../entities/Projet';
import { ok, err, type Result } from '@astiell/shared';
import type { ProjectStatus } from '../../value-objects/ProjectStatus';

interface CreateProjetInput {
  titre: string;
  description: string;
  clientId: string;
  dateDebut: Date;
  statut?: ProjectStatus;
}

export class CreateProjetUseCase {
  constructor(private readonly projetRepository: IProjetRepository) {}

  async execute(input: CreateProjetInput): Promise<Result<Projet>> {
    try {
      const projet = Projet.create({
        ...input,
        statut: input.statut ?? 'EN_ATTENTE',
      });

      return await this.projetRepository.save(projet);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Erreur inattendue'));
    }
  }
}