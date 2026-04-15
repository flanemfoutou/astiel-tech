import { eq } from 'drizzle-orm';
import { InvoiceItem } from '@astiell/domain';
import { ok, err, NotFoundError, type Result } from '@astiell/shared';
import type { IInvoiceItemRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { invoiceItems } from '../schema/invoiceItems';

export class DrizzleInvoiceItemRepository implements IInvoiceItemRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<InvoiceItem>> {
    const [row] = await this.db.select().from(invoiceItems).where(eq(invoiceItems.id, id));
    if (!row) return err(new NotFoundError('InvoiceItem', id));
    return ok(InvoiceItem.reconstitute(row));
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    const rows = await this.db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
    return rows.map(row => InvoiceItem.reconstitute(row));
  }

  async save(item: InvoiceItem): Promise<Result<InvoiceItem>> {
    const plain = item.toPlain();
    await this.db
      .insert(invoiceItems)
      .values(plain)
      .onConflictDoUpdate({
        target: invoiceItems.id,
        set: { designation: plain.designation, quantite: plain.quantite, prixUnitaire: plain.prixUnitaire, montantTotal: plain.montantTotal, updatedAt: new Date() },
      });
    return ok(item);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(invoiceItems).where(eq(invoiceItems.id, id));
    return ok(undefined);
  }

  async deleteByInvoiceId(invoiceId: string): Promise<Result<void>> {
    await this.db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
    return ok(undefined);
  }
}