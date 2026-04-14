import { eq, and } from 'drizzle-orm';
import { Project } from '@astiell/domain';
import { ok, err, type Result } from '@astiell/shared';
import type { IProjectRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { projects } from '../schema/projects';
import { customers } from '../schema/customers';

export class DrizzleProjectRepository implements IProjectRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Project[]> {
    const rows = await this.db.select().from(projects);
    return rows.map(row => Project.reconstitute({
      ...row,
      endDate: row.endDate ?? undefined,
      description: row.description ?? '',
    }));
  }

  async findById(id: string): Promise<Result<Project>> {
    const [row] = await this.db.select().from(projects).where(eq(projects.id, id));
    if (!row) return err(new Error(`Project not found: ${id}`));
    return ok(Project.reconstitute({
      ...row,
      endDate: row.endDate ?? undefined,
      description: row.description ?? '',
    }));
  }

  async findByCustomerId(customerId: string): Promise<Project[]> {
    const rows = await this.db
      .select()
      .from(projects)
      .where(eq(projects.customerId, customerId));
    return rows.map(row => Project.reconstitute({
      ...row,
      endDate: row.endDate ?? undefined,
      description: row.description ?? '',
    }));
  }

  async existsByCustomerAndTitle(customerId: string, title: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.customerId, customerId), eq(projects.title, title)))
      .limit(1);
    return !!row;
  }

  // ✅ Vérifie si le customerId existe dans la table customers
  async existsCustomer(customerId: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
    return !!row;
  }

  async save(project: Project): Promise<Result<Project>> {
    const plain = project.toPlain();
    await this.db
      .insert(projects)
      .values({
        id: plain.id,
        title: plain.title,
        description: plain.description,
        status: plain.status,
        customerId: plain.customerId,
        startDate: plain.startDate,
        endDate: plain.endDate,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          title: plain.title,
          description: plain.description,
          status: plain.status,
          endDate: plain.endDate,
          updatedAt: new Date(),
        },
      });
    return ok(project);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(projects).where(eq(projects.id, id));
    return ok(undefined);
  }
}