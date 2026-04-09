import { eq, count } from 'drizzle-orm';
import { Customer } from '@astiell/domain';
import { ok, err, NotFoundError, paginate, type Result, type PaginationInput, type PaginatedResult } from '@astiell/shared';
import type { ICustomerRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { customers } from '../schema/customers';

export class DrizzleCustomerRepository implements ICustomerRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<Customer>> {
    const [row] = await this.db.select().from(customers).where(eq(customers.id, id));
    if (!row) return err(new NotFoundError('Customer', id));
    return ok(Customer.reconstitute({ ...row, entreprise: row.entreprise ?? undefined, adresse: row.adresse ?? undefined }));
  }

  async findByEmail(email: string): Promise<Result<Customer>> {
    const [row] = await this.db.select().from(customers).where(eq(customers.email, email));
    if (!row) return err(new NotFoundError('Customer', email));
    return ok(Customer.reconstitute({ ...row, entreprise: row.entreprise ?? undefined, adresse: row.adresse ?? undefined }));
  }

  async findAll(pagination?: PaginationInput): Promise<PaginatedResult<Customer>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const offset = (page - 1) * limit;

    const [rows, [{ value: total }]] = await Promise.all([
      this.db.select().from(customers).limit(limit).offset(offset),
      this.db.select({ value: count() }).from(customers),
    ]);

    const items = rows.map(row =>
      Customer.reconstitute({ ...row, entreprise: row.entreprise ?? undefined, adresse: row.adresse ?? undefined })
    );

    return paginate(items, Number(total), { page, limit });
  }

  async save(customer: Customer): Promise<Result<Customer>> {
    const plain = customer.toPlain();
    await this.db
      .insert(customers)
      .values(plain)
      .onConflictDoUpdate({
        target: customers.id,
        set: { nom: plain.nom, prenom: plain.prenom, entreprise: plain.entreprise, adresse: plain.adresse, updatedAt: new Date() },
      });
    return ok(customer);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(customers).where(eq(customers.id, id));
    return ok(undefined);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [row] = await this.db.select({ id: customers.id }).from(customers).where(eq(customers.email, email));
    return !!row;
  }
}