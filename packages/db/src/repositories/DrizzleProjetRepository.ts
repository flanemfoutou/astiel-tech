import { eq } from 'drizzle-orm';
import { Projet } from '@astiell/domain';
import { ok, err, type Result } from '@astiell/shared';
import type { IProjetRepository } from '@astiell/domain';
import type { Database } from '../connection';
import { projets } from '../schema/projets';

export class DrizzleProjetRepository implements IProjetRepository {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Projet[]> {
    const rows = await this.db.select().from(projets);

    return rows.map(row => Projet.reconstitute({
      ...row,
      dateFin: row.dateFin ?? undefined,
    }));
  }

  async findById(id: string): Promise<Result<Projet>> {
    const [row] = await this.db.select().from(projets).where(eq(projets.id, id));

    if (!row) {
      return err(new Error(`Projet introuvable : ${id}`));
    }

    return ok(Projet.reconstitute({
      ...row,
      dateFin: row.dateFin ?? undefined,
    }));
  }

  async findByClientId(clientId: string): Promise<Projet[]> {
    const rows = await this.db
      .select()
      .from(projets)
      .where(eq(projets.clientId, clientId));

    return rows.map(row => Projet.reconstitute({
      ...row,
      dateFin: row.dateFin ?? undefined,
    }));
  }

  async save(projet: Projet): Promise<Result<Projet>> {
    const plain = projet.toPlain();

    await this.db
      .insert(projets)
      .values(plain)
      .onConflictDoUpdate({
        target: projets.id,
        set: {
          titre: plain.titre,
          description: plain.description,
          statut: plain.statut,
          dateFin: plain.dateFin,
          updatedAt: new Date(),
        },
      });

    return ok(projet);
  }

  async delete(id: string): Promise<Result<void>> {
    await this.db.delete(projets).where(eq(projets.id, id));
    return ok(undefined);
  }
}