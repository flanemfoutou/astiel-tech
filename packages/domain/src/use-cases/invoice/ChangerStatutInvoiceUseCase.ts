import type { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import type { Invoice } from '../../entities/Invoice';
import { err, NotFoundError, type Result } from '@astiell/shared';

export type ActionStatut = 'ENVOYER' | 'PAYER' | 'ANNULER';

export class ChangerStatutInvoiceUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(id: string, action: ActionStatut): Promise<Result<Invoice>> {
    try {
      const findResult = await this.invoiceRepository.findById(id);
      if (!findResult.success) return err(new NotFoundError('Invoice', id));

      let updated: Invoice;
      switch (action) {
        case 'ENVOYER': updated = findResult.value.marquerEnvoyee(); break;
        case 'PAYER':   updated = findResult.value.marquerPayee();   break;
        case 'ANNULER': updated = findResult.value.annuler();        break;
      }

      return await this.invoiceRepository.save(updated);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}