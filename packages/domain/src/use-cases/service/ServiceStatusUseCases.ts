import type { IServiceRepository } from '../../repositories/IServiceRepository';
import type { Service } from '../../entities/Service';
import { err, type Result } from '@astiell/shared';

// ─── Shared helper ─────────────────────────────────────────────────────────

async function findOrFail(
  repo: IServiceRepository,
  id: string,
  action: string
): Promise<Result<Service>> {
  if (!id?.trim()) {
    return err(new Error(`"id" is required to ${action} a service. Please provide a valid ID.`));
  }
  const result = await repo.findById(id.trim());
  if (!result.success) {
    return err(
      new Error(`No service found with ID "${id}". Please verify the ID and try again.`)
    );
  }
  return result;
}

// ─── ActiverServiceUseCase ─────────────────────────────────────────────────

export class ActiverServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<Result<Service>> {
    try {
      const findResult = await findOrFail(this.serviceRepository, id, 'activate');
      if (!findResult.success) return findResult;
      const activated = findResult.value.activer();
      return await this.serviceRepository.save(activated);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error while activating service.'));
    }
  }
}

// ─── DesactiverServiceUseCase ──────────────────────────────────────────────

export class DesactiverServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<Result<Service>> {
    try {
      const findResult = await findOrFail(this.serviceRepository, id, 'deactivate');
      if (!findResult.success) return findResult;
      const deactivated = findResult.value.desactiver();
      return await this.serviceRepository.save(deactivated);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error while deactivating service.'));
    }
  }
}

// ─── BloquerServiceUseCase ─────────────────────────────────────────────────

export class BloquerServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<Result<Service>> {
    try {
      const findResult = await findOrFail(this.serviceRepository, id, 'block');
      if (!findResult.success) return findResult;
      const blocked = findResult.value.bloquer();
      return await this.serviceRepository.save(blocked);
    } catch (e) {
      return err(e instanceof Error ? e : new Error('Unexpected error while blocking service.'));
    }
  }
}