import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} introuvable : ${id}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}