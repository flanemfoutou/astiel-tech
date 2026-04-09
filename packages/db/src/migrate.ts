// packages/db/src/migrate.ts
import { resolve } from 'path';

// Charge le .env depuis la racine du monorepo
const envPath = resolve(import.meta.dir, '../../../.env');
await import('bun').then(({ file }) => {
  // Bun charge automatiquement .env, mais on force le bon chemin
});

// Alternative simple : utiliser --env-file dans le script
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL manquant. Vérifie ton fichier .env à la racine.');
}

const sql = neon(connectionString);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: './src/migrations' });
console.log('✅ Migrations appliquées avec succès');
process.exit(0);