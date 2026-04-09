import type { Projet } from '../entities/Projet';
import type { Result } from '@astiell/shared';

export interface IProjetRepository {
  findAll(): Promise<Projet[]>;
  findById(id: string): Promise<Result<Projet>>;
  findByClientId(clientId: string): Promise<Projet[]>;
  save(projet: Projet): Promise<Result<Projet>>;
  delete(id: string): Promise<Result<void>>;
}