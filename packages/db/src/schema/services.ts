import { pgTable, varchar, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const serviceCategoryEnum = pgEnum('service_category', [
  'TIC',
  'GENIE_CIVIL',
  'LOGISTIQUE',
  'COMMERCE',
  'FOURNITURE',
]);

export const services = pgTable('services', {
  // varchar car l'id contient le préfixe "ser-" (ex: ser-550e8400-e29b-...)
  id: varchar('id', { length: 40 }).primaryKey(),
  nom: varchar('nom', { length: 255 }).notNull(),
  description: text('description').notNull(),
  categorie: serviceCategoryEnum('categorie').notNull(),
  tarifJournalier: integer('tarif_journalier'),
  actif: boolean('actif').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ServiceRow = typeof services.$inferSelect;
export type NewServiceRow = typeof services.$inferInsert;