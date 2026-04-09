import type { Customer } from '../entities/Customer';
import type { Result, PaginationInput, PaginatedResult } from '@astiell/shared';

export interface ICustomerRepository {
  findById(id: string): Promise<Result<Customer>>;
  findByEmail(email: string): Promise<Result<Customer>>;
  findAll(pagination?: PaginationInput): Promise<PaginatedResult<Customer>>;
  save(customer: Customer): Promise<Result<Customer>>;
  delete(id: string): Promise<Result<void>>;
  existsByEmail(email: string): Promise<boolean>;
}