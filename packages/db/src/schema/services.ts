import { pgTable, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const serviceCategoryEnum = pgEnum('service_category', [
  'TIC',
  'GENIE_CIVIL',
  'LOGISTIQUE',
  'COMMERCE',
  'FOURNITURE',
]);

export const serviceStatusEnum = pgEnum('service_status', [
  'ACTIF',
  'INACTIF',
  'BLOQUE',
]);

// ✅ Enum pour les noms de services — valeurs fixes du catalogue Astiell
export const serviceNomEnum = pgEnum('service_nom', [
  'DEVELOPPEMENT_APP_WEB_MOBILE',
  'MAINTENANCE_INFORMATIQUE_BUREAUTIQUE',
  'CONNEXION_INTERNET_RESEAUX',
  'VIDEOSURVEILLANCE_CCTV',
  'CONTROLE_ACCES',
  'FOURNITURE_EQUIPEMENTS_INFORMATIQUES',
  'FOURNITURE_CONSOMMABLES_TELECOM',
]);

export const services = pgTable('services', {
  id:              varchar('id', { length: 40 }).primaryKey(),
  nom:             serviceNomEnum('nom').notNull(),              // ✅ enum au lieu de varchar libre
  description:     text('description').notNull(),
  categorie:       serviceCategoryEnum('categorie').notNull(),
  tarifJournalier: integer('tarif_journalier'),
  statut:          serviceStatusEnum('statut').notNull().default('ACTIF'),
  createdAt:       timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:       timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ServiceRow = typeof services.$inferSelect;
export type NewServiceRow = typeof services.$inferInsert;