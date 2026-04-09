import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { buildContext } from './context';

const yoga = createYoga({ schema, context: buildContext });

const server = Bun.serve({
  port: process.env.PORT ?? 4000,
  fetch: yoga.fetch,
});

console.log(`🚀 AstiellServices API lancée sur http://localhost:${server.port}/graphql`);