import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const projectServices = pgTable('project_services', {
  id: varchar('id', { length: 45 }).primaryKey(),
  projetId: varchar('projet_id', { length: 45 }).notNull(),
  serviceId: varchar('service_id', { length: 40 }).notNull(),
  quantite: integer('quantite').notNull().default(1),
  prixUnitaire: integer('prix_unitaire').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ProjectServiceRow = typeof projectServices.$inferSelect;
export type NewProjectServiceRow = typeof projectServices.$inferInsert;