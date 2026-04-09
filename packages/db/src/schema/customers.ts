import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  nom: varchar('nom', { length: 100 }).notNull(),
  prenom: varchar('prenom', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  telephone: varchar('telephone', { length: 20 }).notNull(),
  entreprise: varchar('entreprise', { length: 255 }),
  adresse: text('adresse'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type CustomerRow = typeof customers.$inferSelect;
export type NewCustomerRow = typeof customers.$inferInsert;