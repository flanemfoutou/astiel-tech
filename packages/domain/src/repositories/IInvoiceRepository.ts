import type { Invoice } from '../entities/Invoice';
import type { Result, PaginationInput, PaginatedResult } from '@astiell/shared';

export interface IInvoiceRepository {
  findById(id: string): Promise<Result<Invoice>>;
  findByProjetId(projetId: string): Promise<Invoice[]>;
  findByCustomerId(customerId: string): Promise<Invoice[]>;
  findAll(pagination?: PaginationInput): Promise<PaginatedResult<Invoice>>;
  save(invoice: Invoice): Promise<Result<Invoice>>;
  delete(id: string): Promise<Result<void>>;
}