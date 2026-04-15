import { pgTable, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const serviceCategoryEnum = pgEnum('service_category', [
  'TIC',
  'GENIE_CIVIL',
  'LOGISTIQUE',
  'COMMERCE',
  'FOURNITURE',
]);

// ✅ Enum statut
export const serviceStatusEnum = pgEnum('service_status', [
  'ACTIF',
  'INACTIF',
  'BLOQUE',
]);

export const services = pgTable('services', {
  id: varchar('id', { length: 40 }).primaryKey(),
  nom: varchar('nom', { length: 255 }).notNull(),
  description: text('description').notNull(),
  categorie: serviceCategoryEnum('categorie').notNull(),
  tarifJournalier: integer('tarif_journalier'),
  statut: serviceStatusEnum('statut').notNull().default('ACTIF'), // ✅ remplace actif
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ServiceRow = typeof services.$inferSelect;
export type NewServiceRow = typeof services.$inferInsert;