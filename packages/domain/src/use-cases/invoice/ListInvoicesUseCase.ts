import type { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import type { Invoice } from '../../entities/Invoice';
import type { PaginationInput, PaginatedResult } from '@astiell/shared';

export class ListInvoicesUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(pagination?: PaginationInput): Promise<PaginatedResult<Invoice>> {
    return this.invoiceRepository.findAll(pagination);
  }
}