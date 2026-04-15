import type { InvoiceItem } from '../entities/InvoiceItem';
import type { Result } from '@astiell/shared';

export interface IInvoiceItemRepository {
  findById(id: string): Promise<Result<InvoiceItem>>;
  findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]>;
  save(item: InvoiceItem): Promise<Result<InvoiceItem>>;
  delete(id: string): Promise<Result<void>>;
  deleteByInvoiceId(invoiceId: string): Promise<Result<void>>;
}