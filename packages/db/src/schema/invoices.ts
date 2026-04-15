import { pgTable, varchar, integer, numeric, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'BROUILLON',
  'ENVOYEE',
  'PAYEE',
  'ANNULEE',
]);

export const invoices = pgTable('invoices', {
  id: varchar('id', { length: 45 }).primaryKey(),
  numero: varchar('numero', { length: 30 }).notNull().unique(),
  projetId: varchar('projet_id', { length: 45 }).notNull(),
  customerId: varchar('customer_id', { length: 40 }).notNull(),
  statut: invoiceStatusEnum('statut').notNull().default('BROUILLON'),
  dateEmission: timestamp('date_emission', { withTimezone: true }).notNull(),
  dateEcheance: timestamp('date_echeance', { withTimezone: true }).notNull(),
  montantHT: integer('montant_ht').notNull(),
  tauxTVA: numeric('taux_tva', { precision: 5, scale: 2 }).notNull(),
  montantTVA: integer('montant_tva').notNull(),
  montantTTC: integer('montant_ttc').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type InvoiceRow = typeof invoices.$inferSelect;
export type NewInvoiceRow = typeof invoices.$inferInsert;