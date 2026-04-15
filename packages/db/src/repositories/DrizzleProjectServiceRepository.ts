import { eq } from 'drizzle-orm';
import { ProjectService } from '@astiell/domain';
import { ok, err, NotFoundError, type Result } from '@astiell/shared';
import type { IProjectServiceRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { projectServices } from '../schema/projectServices';

export class DrizzleProjectServiceRepository implements IProjectServiceRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<ProjectService>> {
    const [row] = await this.db.select().from(projectServices).where(eq(projectServices.id, id));
    if (!row) return err(new NotFoundError('ProjectService', id));
    return ok(ProjectService.reconstitute(row));
  }

  async findByProjetId(projetId: string): Promise<ProjectService[]> {
    const rows = await this.db.select().from(projectServices).where(eq(projectServices.projetId, projetId));
    return rows.map(row => ProjectService.reconstitute(row));
  }

  async findByServiceId(serviceId: string): Promise<ProjectService[]> {
    const rows = await this.db.select().from(projectServices).where(eq(projectServices.serviceId, serviceId));
    return rows.map(row => ProjectService.reconstitute(row));
  }

  async save(ps: ProjectService): Promise<Result<ProjectService>> {
    const plain = ps.toPlain();
    await this.db
      .insert(projectServices)
      .values(plain)
      .onConflictDoUpdate({
        target: projectServices.id,
        set: { quantite: plain.quantite, prixUnitaire: plain.prixUnitaire, updatedAt: new Date() },
      });
    return ok(ps);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(projectServices).where(eq(projectServices.id, id));
    return ok(undefined);
  }
}