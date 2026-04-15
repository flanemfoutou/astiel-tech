import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const invoiceItems = pgTable('invoice_items', {
  id: varchar('id', { length: 50 }).primaryKey(),
  invoiceId: varchar('invoice_id', { length: 45 }).notNull(),
  projectServiceId: varchar('project_service_id', { length: 45 }).notNull(),
  designation: varchar('designation', { length: 255 }).notNull(),
  quantite: integer('quantite').notNull(),
  prixUnitaire: integer('prix_unitaire').notNull(),
  montantTotal: integer('montant_total').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type InvoiceItemRow = typeof invoiceItems.$inferSelect;
export type NewInvoiceItemRow = typeof invoiceItems.$inferInsert;