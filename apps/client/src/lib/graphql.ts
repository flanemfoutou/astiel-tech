import { GraphQLClient } from 'graphql-request';

export const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
);
