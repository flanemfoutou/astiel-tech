import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { buildContext } from './context';

const yoga = createYoga({
  schema,
  context: buildContext,
  // ✅ Désactive le masquage des erreurs pour propager les vrais messages
  maskedErrors: false,
});

const server = Bun.serve({
  port: process.env.PORT ?? 4000,
  fetch: yoga.fetch,
});

console.log(`🚀 AstiellServices API lancée sur http://localhost:${server.port}/graphql`);