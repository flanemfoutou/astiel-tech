import { eq } from 'drizzle-orm';
import { Service, type ServiceCategory } from '@astiell/domain';
import { ok, err, NotFoundError, type Result } from '@astiell/shared';
import type { IServiceRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { services } from '../schema/services';

export class DrizzleServiceRepository implements IServiceRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<Service>> {
    const [row] = await this.db.select().from(services).where(eq(services.id, id));
    if (!row) return err(new NotFoundError('Service', id));
    return ok(Service.reconstitute({ ...row, tarifJournalier: row.tarifJournalier ?? undefined }));
  }

  async findByCategorie(categorie: ServiceCategory): Promise<Service[]> {
    const rows = await this.db.select().from(services).where(eq(services.categorie, categorie));
    return rows.map(row => Service.reconstitute({ ...row, tarifJournalier: row.tarifJournalier ?? undefined }));
  }

  async findActifs(): Promise<Service[]> {
    const rows = await this.db.select().from(services).where(eq(services.actif, true));
    return rows.map(row => Service.reconstitute({ ...row, tarifJournalier: row.tarifJournalier ?? undefined }));
  }

  async save(service: Service): Promise<Result<Service>> {
    const plain = service.toPlain();
    await this.db
      .insert(services)
      .values(plain)
      .onConflictDoUpdate({
        target: services.id,
        set: { nom: plain.nom, description: plain.description, actif: plain.actif, tarifJournalier: plain.tarifJournalier, updatedAt: new Date() },
      });
    return ok(service);
  }
}