import { eq, and, count } from 'drizzle-orm';
import { Service, type ServiceCategory, type ServiceNom } from '@astiell/domain';
import { ok, err, NotFoundError, paginate, type Result, type PaginationInput, type PaginatedResult } from '@astiell/shared';
import type { IServiceRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { services } from '../schema/services';

export class DrizzleServiceRepository implements IServiceRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<Service>> {
    const [row] = await this.db.select().from(services).where(eq(services.id, id));
    if (!row) return err(new NotFoundError('Service', id));
    return ok(Service.reconstitute({
      ...row,
      tarifJournalier: row.tarifJournalier ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async findByNomAndCategorie(nom: ServiceNom, categorie: ServiceCategory): Promise<Service | null> {
    const [row] = await this.db
      .select()
      .from(services)
      .where(and(eq(services.nom, nom), eq(services.categorie, categorie)));
    if (!row) return null;
    return Service.reconstitute({
      ...row,
      tarifJournalier: row.tarifJournalier ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });
  }

  async findByCategorie(categorie: ServiceCategory): Promise<Service[]> {
    const rows = await this.db.select().from(services).where(eq(services.categorie, categorie));
    return rows.map(row => Service.reconstitute({
      ...row,
      tarifJournalier: row.tarifJournalier ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async findActifs(): Promise<Service[]> {
    const rows = await this.db.select().from(services).where(eq(services.statut, 'ACTIF'));
    return rows.map(row => Service.reconstitute({
      ...row,
      tarifJournalier: row.tarifJournalier ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async findInactifs(): Promise<Service[]> {
    const rows = await this.db.select().from(services).where(eq(services.statut, 'INACTIF'));
    return rows.map(row => Service.reconstitute({
      ...row,
      tarifJournalier: row.tarifJournalier ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async findBloques(): Promise<Service[]> {
    const rows = await this.db.select().from(services).where(eq(services.statut, 'BLOQUE'));
    return rows.map(row => Service.reconstitute({
      ...row,
      tarifJournalier: row.tarifJournalier ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async findAll(pagination?: PaginationInput): Promise<PaginatedResult<Service>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const offset = (page - 1) * limit;

    const [rows, [{ value: total }]] = await Promise.all([
      this.db.select().from(services).limit(limit).offset(offset),
      this.db.select({ value: count() }).from(services),
    ]);

    const items = rows.map(row =>
      Service.reconstitute({
        ...row,
        tarifJournalier: row.tarifJournalier ?? undefined,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      })
    );

    return paginate(items, Number(total), { page, limit });
  }

  async save(service: Service): Promise<Result<Service>> {
    const values = {
      id:              service.id,
      nom:             service.nom,
      description:     service.description,
      categorie:       service.categorie,
      statut:          service.statut,
      tarifJournalier: service.tarifJournalier,
      createdAt:       service.createdAt,
      updatedAt:       service.updatedAt,
    };

    await this.db
      .insert(services)
      .values(values)
      .onConflictDoUpdate({
        target: services.id,
        set: {
          nom:             values.nom,
          description:     values.description,
          categorie:       values.categorie,
          statut:          values.statut,
          tarifJournalier: values.tarifJournalier,
          updatedAt:       new Date(),
        },
      });

    return ok(service);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(services).where(eq(services.id, id));
    return ok(undefined);
  }
}