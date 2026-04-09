import type { ICustomerRepository } from '../../repositories/ICustomerRepository';
import type { Customer } from '../../entities/Customer';
import type { Result } from '@astiell/shared';

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<Result<Customer>> {
    return this.customerRepository.findById(id);
  }
}