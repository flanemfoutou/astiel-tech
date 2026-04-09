import { makeExecutableSchema } from '@graphql-tools/schema';
import { customerTypeDefs } from './modules/customer/customer.schema';
import { projetTypeDefs } from './modules/projet/projet.schema';
import { serviceTypeDefs } from './modules/service/service.schema';
import { customerResolvers } from './modules/customer/customer.resolver';
import { projetResolvers } from './modules/projet/projet.resolver';
import { serviceResolvers } from './modules/service/service.resolver';

const rootTypeDefs = /* GraphQL */ `
  type Query { _empty: String }
  type Mutation { _empty: String }
`;

export const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, customerTypeDefs, projetTypeDefs, serviceTypeDefs],
  resolvers: [customerResolvers, projetResolvers, serviceResolvers],
});