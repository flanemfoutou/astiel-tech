import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import type { Customer } from '../../entities/Customer';
import type { PaginationInput, PaginatedResult } from '@astiell/shared';

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(pagination?: PaginationInput): Promise<PaginatedResult<Customer>> {
    return this.customerRepository.findAll(pagination);
  }
}