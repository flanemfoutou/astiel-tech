import type { Customer } from '../entities/Customer';
import type { Result } from '@astiell/shared';
import type { PaginationInput, PaginatedResult } from '@astiell/shared';

export interface ICustomerRepository {
  findById(id: string): Promise<Result<Customer>>;
  findByEmail(email: string): Promise<Result<Customer>>;
  findAll(pagination?: PaginationInput): Promise<PaginatedResult<Customer>>;
  existsByEmailOrPhone(
    email: string,
    telephone: string,
    excludeId?: string  // ✅ exclut le customer en cours de modification
  ): Promise<{ exists: boolean; field: 'email' | 'telephone' | null }>;
  existsByFullName(
    nom: string,
    prenom: string,
    excludeId?: string  // ✅ exclut le customer en cours de modification
  ): Promise<boolean>;
  save(customer: Customer): Promise<Result<Customer>>;
  delete(id: string): Promise<Result<void>>;
}