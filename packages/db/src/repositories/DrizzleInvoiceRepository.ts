import { eq, count } from 'drizzle-orm';
import { Invoice } from '@astiell/domain';
import { ok, err, NotFoundError, paginate, type Result, type PaginationInput, type PaginatedResult } from '@astiell/shared';
import type { IInvoiceRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { invoices } from '../schema/invoices';

export class DrizzleInvoiceRepository implements IInvoiceRepository {
  constructor(private readonly db: Database) {}

  private mapRow(row: typeof invoices.$inferSelect): Invoice {
    return Invoice.reconstitute({
      ...row,
      tauxTVA: Number(row.tauxTVA),
      notes: row.notes ?? undefined,
    });
  }

  async findById(id: string): Promise<Result<Invoice>> {
    const [row] = await this.db.select().from(invoices).where(eq(invoices.id, id));
    if (!row) return err(new NotFoundError('Invoice', id));
    return ok(this.mapRow(row));
  }

  async findByProjetId(projetId: string): Promise<Invoice[]> {
    const rows = await this.db.select().from(invoices).where(eq(invoices.projetId, projetId));
    return rows.map(r => this.mapRow(r));
  }

  async findByCustomerId(customerId: string): Promise<Invoice[]> {
    const rows = await this.db.select().from(invoices).where(eq(invoices.customerId, customerId));
    return rows.map(r => this.mapRow(r));
  }

  async findAll(pagination?: PaginationInput): Promise<PaginatedResult<Invoice>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const offset = (page - 1) * limit;

    const [rows, [{ value: total }]] = await Promise.all([
      this.db.select().from(invoices).limit(limit).offset(offset),
      this.db.select({ value: count() }).from(invoices),
    ]);

    return paginate(rows.map(r => this.mapRow(r)), Number(total), { page, limit });
  }

  async save(invoice: Invoice): Promise<Result<Invoice>> {
    const plain = invoice.toPlain();
    await this.db
      .insert(invoices)
      .values(plain)
      .onConflictDoUpdate({
        target: invoices.id,
        set: { statut: plain.statut, montantHT: plain.montantHT, montantTVA: plain.montantTVA, montantTTC: plain.montantTTC, notes: plain.notes, updatedAt: new Date() },
      });
    return ok(invoice);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(invoices).where(eq(invoices.id, id));
    return ok(undefined);
  }
}