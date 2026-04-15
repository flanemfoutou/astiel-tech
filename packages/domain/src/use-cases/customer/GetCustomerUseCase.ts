import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import type { Customer } from '../../entities/Customer';
import { err, ValidationError, NotFoundError, type Result } from '@astiell/shared';

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<Result<Customer>> {
    // ── 1. No ID provided → stop here, no DB round-trip ──────────────────────
    if (!id || id.trim() === '') {
      return err(
        new ValidationError(
          'Customer ID is required. Please provide a valid ID.',
          'id'
        )
      );
    }

    // ── 2. DB lookup ──────────────────────────────────────────────────────────
    const result = await this.customerRepository.findById(id.trim());

    if (!result.success) {
      return err(
        new NotFoundError(
          `No customer found with ID "${id}". Please provide the correct ID.`
        )
      );
    }

    return result;
  }
}