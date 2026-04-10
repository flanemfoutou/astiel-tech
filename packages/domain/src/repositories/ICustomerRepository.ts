import type { Customer } from '../entities/Customer';
import type { Result } from '@astiell/shared';
import type { PaginationInput, PaginatedResult } from '@astiell/shared';

export interface ICustomerRepository {
  findById(id: string): Promise<Result<Customer>>;
  findByEmail(email: string): Promise<Result<Customer>>;
  findAll(pagination?: PaginationInput): Promise<PaginatedResult<Customer>>;
  // ✅ Remplace existsByEmail
  existsByEmailOrPhone(
    email: string,
    telephone: string
  ): Promise<{ exists: boolean; field: 'email' | 'telephone' | null }>;
  save(customer: Customer): Promise<Result<Customer>>;
  delete(id: string): Promise<Result<void>>;
}