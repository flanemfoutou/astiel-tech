import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const projets = pgTable('projets', {
  id: text('id').primaryKey(),
  titre: text('titre').notNull(),
  description: text('description'),
  statut: text('statut').notNull(),
  clientId: text('clientId').notNull(),
  dateDebut: timestamp('dateDebut').notNull(),
  dateFin: timestamp('dateFin'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});
