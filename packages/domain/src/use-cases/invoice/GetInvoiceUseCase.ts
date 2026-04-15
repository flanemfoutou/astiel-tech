import type { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import type { Invoice } from '../../entities/Invoice';
import type { Result } from '@astiell/shared';

export class GetInvoiceUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<Result<Invoice>> {
    return this.invoiceRepository.findById(id);
  }
}