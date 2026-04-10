import { makeExecutableSchema } from '@graphql-tools/schema';
import { customerTypeDefs } from './modules/customer/customer.schema';
import { projectTypeDefs } from './modules/project/project.schema';   // ✅
import { serviceTypeDefs } from './modules/service/service.schema';
import { customerResolvers } from './modules/customer/customer.resolver';
import { projectResolvers } from './modules/project/project.resolver'; // ✅
import { serviceResolvers } from './modules/service/service.resolver';

const rootTypeDefs = /* GraphQL */ `
  type Query { _empty: String }
  type Mutation { _empty: String }
`;

export const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, customerTypeDefs, projectTypeDefs, serviceTypeDefs],
  resolvers: [customerResolvers, projectResolvers, serviceResolvers],
});